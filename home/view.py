from django.shortcuts import render,redirect
from django.http import *
from .models import *
from datetime import datetime
from dateutil.parser import parse

import json
import hashlib, os

statusList = {
    1 : {
        'name':'Schedule measure',
        'time':24,
    },
    2 : {
        'name':'Complete measure',
        'time':24,
    },
    3: {
        'name':'Quote Ready',
        'time':48,
    },
    4: {
        'name':'Quote sent',
        'time':120,
    },
    5: {
        'name': 'Order Materials',
        'time': 24,
    },
    6: {
        'name':'Materials Received',
        'time':14*24,
    },
    7: {
        'name':'Schedule Delivery/pick up',
        'time':24,
    },
    8: {
        'name':'Schedule install',
        'time':48,
    }
}


def ajaxLogin(request) :
    # print("come here", request)
    r_body = request.body
    postParams = json.loads(r_body)
    email = postParams['username']
    password = postParams['password']
    status = 0
    id = None
    if User.objects.filter(email=email,is_active=1).exists() :
        user = User.objects.filter(email=email)[0]
        if user.check_password(password) :
            status = 1
            id = user.id
            request.session['user_id'] = email
            request.session['user'] = user.id
        else :
            status = 2

    response = {'status': status, 'id': id }
    return JsonResponse(response)

def getClientList(request) :

    _cur_time = datetime.now().time()
    print("test======>", _cur_time)
    r_body = request.body
    postParams = json.loads(r_body)
    user_id = postParams['user_id']
    role = getRole(user_id)
    userList = User.objects.all().values('id','first_name','last_name')

    clientList = []
    if role == 1: # admin case
        clientList = Client.objects.all().filter(job_state=0).values('id', 'install_payout', 'name', 'note', 'region', 'ric_payout', 'sales_potential', 'status', 'user', 'user_id', 'wait_time')
    else:
        clientList = Client.objects.filter(user_id=user_id).filter(job_state=0).values('id', 'install_payout', 'name', 'note', 'region', 'ric_payout', 'sales_potential', 'status', 'user', 'user_id', 'wait_time')
    for client in clientList:
        time = client['wait_time']
        dt = parse(time)
        _hour = dt.time().hour
        _min = dt.time().minute
        _sec = dt.time().second
        _day = dt.date().day

        cur_time = datetime.now()
        day = cur_time.day
        hour = cur_time.hour
        min1 = cur_time.minute
        sec = cur_time.second
        delta = (day - _day) * 24 * 60 * 60 + (hour - _hour) * 60 * 60 + (min1 - _min) * 60 + (sec - _sec)
        client['wait_time'] = dt.strftime("%D %H:%M:%S")
        if delta < statusList[client['status']].get('time')*60*60 :
            client['expired'] = 0
        else :
            client['expired'] = 1

        if client['status'] == 8:
            client['expired'] = 2  # finish

        if client['status'] < 8:
            client['action'] = client['status'] + 1
            client['status_name'] = statusList[client['status']]['name']
            client['action_name'] = statusList[client['action']]['name']
        else :
            client['status_name'] = statusList[client['status']]['name']
            client['action'] = ''

    #sort again by expired time
    orderClientList = []
    for client in clientList:
        if client['expired'] == 1:
            orderClientList.append(client)
    for client in clientList:
        if client['expired'] == 0:
            orderClientList.append(client)
    for client in clientList:
        if client['expired'] == 2:
            orderClientList.append(client)

    return JsonResponse({ 'list':list(orderClientList), 'users': list(userList)})

def getOtherClientList(request) :
    r_body = request.body
    postParams = json.loads(r_body)
    user_id = postParams['user_id']
    role = getRole(user_id)
    userList = User.objects.all().values('id', 'first_name', 'last_name')

    clientList = []
    if role == 1:  # admin case
        clientList = Client.objects.all().extra(where=['FIND_IN_SET(job_state, "1,2")']).values('id', 'install_payout', 'name', 'note', 'region', 'ric_payout',
                                                 'sales_potential', 'status', 'user', 'user_id', 'wait_time', 'job_state')
    else:
        clientList = Client.objects.filter(user_id=user_id).extra(where=['FIND_IN_SET(job_state, "1,2")']).values('id',
                                                                                                         'install_payout',
                                                                                                         'name', 'note',
                                                                                                         'region',
                                                                                                         'ric_payout',
                                                                                                         'sales_potential',
                                                                                                         'status',
                                                                                                         'user',
                                                                                                         'user_id',
                                                                                                         'wait_time',
                                                                                                         'job_state')
    for client in clientList:
        time = client['wait_time']
        dt = parse(time)
        _hour = dt.time().hour
        _day = dt.date().day

        cur_time = datetime.now()
        day = cur_time.day
        hour = cur_time.hour
        delta = (hour - _hour) + (day - _day) * 24
        client['wait_time'] = dt.strftime("%D %H:%M:%S")
        print("test delta===>", delta)
        if delta < statusList[client['status']].get('time'):
            client['expired'] = 0
        else:
            client['expired'] = 1

        if client['status'] == 8:
            client['expired'] = 2  # finish

        if client['status'] < 8:
            client['action'] = client['status'] + 1
            client['status_name'] = statusList[client['status']]['name']
            client['action_name'] = statusList[client['action']]['name']
        else:
            client['status_name'] = statusList[client['status']]['name']
            client['action'] = ''

    # sort again by expired time
    orderClientList = []
    for client in clientList:
        if client['expired'] == 1:
            orderClientList.append(client)
    for client in clientList:
        if client['expired'] == 0:
            orderClientList.append(client)
    for client in clientList:
        if client['expired'] == 2:
            orderClientList.append(client)

    return JsonResponse({'list': list(orderClientList), 'users': list(userList)})

def deleteClient(request) :

    r_body = request.body
    postParams = json.loads(r_body)
    client_id = postParams['client_id']

    if Client.objects.filter(id=client_id).exists() :
        client = Client.objects.filter(id=client_id)[0]
        client.job_state = 1
        client.save()

    return JsonResponse({'status': 1})

def cancelClient(request) :

    r_body = request.body
    postParams = json.loads(r_body)
    client_id = postParams['client_id']

    if Client.objects.filter(id=client_id).exists():
        client = Client.objects.filter(id=client_id)[0]
        client.job_state = 2
        client.save()

    return JsonResponse({'status': 1})

def getClientDetail(request):
    r_body = request.body
    postParams = json.loads(r_body)

    if postParams == {}:
        client_id = ''
    else :
        client_id = postParams['client_id']

    if client_id == '':
        client_id = 0
    client = ''
    if Client.objects.filter(id=client_id).exists():
        client = Client.objects.filter(id=client_id).values('id', 'install_payout', 'name', 'note', 'region', 'ric_payout', 'sales_potential', 'status', 'user', 'user_id', 'wait_time')
    return JsonResponse({'status':statusList,'client':list(client)})

def saveClientDetail(request):
    r_body = request.body
    postParams = json.loads(r_body)
    data = postParams['data']

    if 'id' in data:
        client = Client.objects.get(pk=data.get('id'))
        client.install_payout = data.get('install_payout')
        client.name = data.get('name')
        client.note = data.get('note')
        client.region = data.get('region')
        client.status = data.get('status')
        client.ric_payout = data.get('ric_payout')
        client.sales_potential = data.get('sales_potential')
        client.wait_time = data.get('wait_time')
        client.user_id = data.get('user_id')
        client.save()
    else :
        client = Client(
            name=data.get('name'),
            install_payout=data.get('install_payout'),
            note=data.get('note'),
            region=data.get('region'),
            status=1,
            ric_payout=data.get('ric_payout'),
            sales_potential=data.get('sales_potential'),
            wait_time=data.get('wait_time'),
            user_id=data.get('user_id')
        )
        client.save()

    return JsonResponse({'status':1})

def getUserList(request) :

    userList = User.objects.filter(is_superuser=0).values('id','email','first_name','last_name','is_active')

    return JsonResponse({ 'list':list(userList) })

def logout(request) :
    request.session['user_id'] = None
    return JsonResponse({'msg':'success'})

def getRole(user_id):
    role = -1
    if User.objects.filter(id=user_id).exists():
        user = User.objects.get(pk=user_id)
        role = user.is_superuser
    return role

