# Doctor Route

`{{Route}}={{BASE_URL}}/doctor`

## Table of matters

- [List of all the doctors](#get-doctors-list)
- [Sign Up/ Create new account](#sign-up)
- [Sign In](#sign-in)
- [Validate Token](#validate-token)
- [new account validation](#account-validation)
- [Patient list](#patient-list)
- [Delete from the doctor's patient list](#delete-patient-from-patient-list)
- [Account restoration link](#account-restoration-link)
- [Doctor's info (by ID)](#doctors-information)
- [Search for Doctor's info (by username or email)](#search-doctors)
- [Delete account](#delete-account)
- [Update doctor's mail](#update-doctors-mail)
- [Update doctor's username](#update-doctors-username)
- [Update doctor's password](#update-doctors-password)
- [Update doctor's name](#update-doctors-name)
- [Update doctor's phone number](#update-doctors-phone-number)
- [Update doctor's Accept method](#update-doctors-accept-method)
- [Update doctor's daira](#update-doctors-daira)

---

### Get doctor's list

Return the list of all the doctor's

`GET {{Route}}/`

#### Response status

##### `HTTP STATUS 200`

```
{
    "results":[
        {
            "id": 6,
            "username": "test",
            "first_name": "Hamaidi",
            "last_name": "Youcef",
            "sexe": false, // false = Male, true = Female
            "auto_accept": false,
            "created_at": "2022-10-15T00:00:00.000Z",
            "phone_number": "790030013",
            "mail": "hamaidisyo938o@hotmail.com",
            "id_daira": 2,
            "nomDaira": "Daira 2",
            "idWilaya": 1,
            "nomWilaya": "wilaya 1"
        },
        ...
    ]
}
```

##### `HTTP STATUS 500`

---

### Sign up

Create new doctor account

`POST {{Route}}/`

#### In body

| Field           | Type   | Required | validation        |
| --------------- | ------ | -------- | ----------------- |
| username        | string | yes      | length>6          |
| password        | string | yes      | length>8          |
| repeat_password | string | yes      | equal to password |
| mail            | string | yes      | valid mail        |
| first_name      | string | yes      | length<50         |
| last_name       | string | yes      | length<50         |
| phone_number    | string | yes      | length <= 10      |
| sex             | string | yes      | length=1          |
| address         | string | yes      | length<400        |
| id_wilaya       | number | yes      | -                 |
| id_daira        | number | yes      | -                 |

#### Response status

##### `HTTP STATUS 201`

```
{
    "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwidXNlcm5hbWUiOiJ0ZXN0aW5nU2VxMiIsImlhdCI6MTY2NTg3MzY2OX0.50Oked36Sykk_nG5MOwUQflR61jtW59mUBz0BavTB0I"
}
```

##### `HTTP STATUS 400`

| Key     | Value  |
| ------- | ------ |
| type    | string |
| path    | string |
| message | string |

##### `HTTP STATUS 500`

---

### Sign In

Generate new token

`POST {{Route}}/token`

#### In body

| Field    | Type   | Required | validation |
| -------- | ------ | -------- | ---------- |
| username | string | yes      | length>6   |
| password | string | yes      | length>8   |

#### Response status

##### `HTTP STATUS 201`

```
{
    "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwidXNlcm5hbWUiOiJ0ZXN0aW5nU2VxMiIsImlhdCI6MTY2NTg3MzY2OX0.50Oked36Sykk_nG5MOwUQflR61jtW59mUBz0BavTB0I"
}
```

##### `HTTP STATUS 400`

| Key  | Value  |
| ---- | ------ |
| type | string |
| path | string |

##### `HTTP STATUS 500`

---

### Validate token

Check if the token is still valid or not

`HEAD {{Route}}/`

#### Response status

##### `HTTP STATUS 200`

##### `HTTP STATUS 401/500`

---

### Account validation

Validate new account

`HEAD {{Route}}/validation/:token`

#### In parameters

| Field | Type   | Required |
| ----- | ------ | -------- |
| token | string | yes      |

#### Response status

##### `HTTP STATUS 200`

##### `HTTP STATUS 401/500`

---

### Patient list

Return the doctor's list of patients

`GET {{Route}}/:id_doctor/patientlist`

#### In parameters

| Field     | Type   | Required |
| --------- | ------ | -------- |
| id_doctor | number | yes      |

#### Response status

##### `HTTP STATUS 200`

```
{
    "results": [
        {
            "id": 1,
            "username": "patient",
            "mail": "hamaidi.yo@gmail.com",
            "first_name": "Hamaidi",
            "last_name": "Youcef",
            "sex": 0,
            "birth_date": "2022-10-23T23:00:00.000Z",
            "address": "my address",
            "photo": null,
            "severity": 1,
            "created_at": "2022-10-23T23:00:00.000Z",
            "phone_number": "0000010001",
            "id_illness_type": 1,
            "illness_type": "type 1",
            "id_commune": 1,
            "commune_name": "commune 1",
            "id_daira": 1,
            "daira_name": "Daira 1",
            "id_wilaya": 1,
            "wliaya_name": "wilaya 1",
            "id_doctor": 12,
            "id_relative": null,
            "relative_first_name": null,
            "relative_last_name": null,
            "relative_phone_number": null,
            "relative_mail": null
        },
        ...
    ]
}
```

##### `HTTP STATUS 401/403/500`

---

### Delete patient from patient list

Remove a patient from the doctor's patient list

`DELETE {{Route}}/:id_doctor/patientlist/:idPatient`

#### In parameters

| Field      | Type   | Required |
| ---------- | ------ | -------- |
| id_doctor  | number | yes      |
| id_patient | number | yes      |

#### Response status

##### `HTTP STATUS 204`

##### `HTTP STATUS 400`

| Key  | Value  |
| ---- | ------ |
| type | string |
| path | string |

##### `HTTP STATUS 401/403/500`

---

### Account restoration link

Send password restoration link

`POST {{Route}}/restorelink`

#### In parameters

| Field | Type   | Required | validation |
| ----- | ------ | -------- | ---------- |
| mail  | string | yes      | Valid mail |

#### Response status

##### `HTTP STATUS 200`

##### `HTTP STATUS 400`

| Key  | Value  |
| ---- | ------ |
| type | string |
| path | string |

##### `HTTP STATUS 500`

---

### Doctors information

Return a doctor's information

`GET {{Route}}/:id_doctor`

#### In parameters

| Field     | Type   | Required |
| --------- | ------ | -------- |
| id_doctor | number | yes      |

#### Response status

##### `HTTP STATUS 200`

##### `HTTP STATUS 400`

| Key  | Value  |
| ---- | ------ |
| type | string |
| path | string |

##### `HTTP STATUS 401/500`

---

### Search doctors

search doctor by username or mail, one of the values is required (and more than one is allowed)

`GET {{Route}}/?mail=:mail&username=:username`

#### In parameters

| Field    | Type   | Required |
| -------- | ------ | -------- |
| username | number | no       |
| mail     | number | no       |

#### Response status

##### `HTTP STATUS 200`

```
{
    "results": [
        {
            "id": 1,
            "username": "patient",
            "mail": "hamaidi.yo@gmail.com",
            "first_name": "Hamaidi",
            "last_name": "Youcef",
            "sex": 0,
            "birth_date": "2022-10-23T23:00:00.000Z",
            "address": "my address",
            "photo": null,
            "severity": 1,
            "created_at": "2022-10-23T23:00:00.000Z",
            "phone_number": "790150064",
            "id_illness_type": 1,
            "illness_type": "type 1",
            "id_commune": 1,
            "commune_name": "commune 1",
            "id_daira": 1,
            "daira_name": "Daira 1",
            "id_wilaya": 1,
            "wliaya_name": "wilaya 1",
            "id_doctor": 12,
            "id_relative": null,
            "relative_first_name": null,
            "relative_last_name": null,
            "relative_phone_number": null,
            "relative_mail": null
        },
        ...
    ]
}
```

##### `HTTP STATUS 400`

| Key     | Value  |
| ------- | ------ |
| type    | string |
| path    | string |
| message | string |

##### `HTTP STATUS 401/500`

---

### Delete account

Delete doctor's account

`DELETE {{Route}}/:id_doctor`

#### In parameters

| Field     | Type   | Required |
| --------- | ------ | -------- |
| id_doctor | number | yes      |

#### Response status

##### `HTTP STATUS 204`

##### `HTTP STATUS 400`

| Key     | Value  |
| ------- | ------ |
| type    | string |
| path    | string |
| message | string |

##### `HTTP STATUS 401/403/500`

---

### Update doctor's mail

Update doctor's e-mail

`PUT {{Route}}/:id_doctor/mail`

#### In parameters

| Field     | Type   | Required |
| --------- | ------ | -------- |
| id_doctor | number | yes      |

#### In body

| Field | Type   | Required | validation |
| ----- | ------ | -------- | ---------- |
| email | string | yes      | valid mail |

#### Response status

##### `HTTP STATUS 204`

##### `HTTP STATUS 400`

| Key     | Value  |
| ------- | ------ |
| type    | string |
| path    | string |
| message | string |

##### `HTTP STATUS 401/403/500`

---

### Update doctor's username

Update doctor's username

`PUT {{Route}}/:id_doctor/username`

#### In parameters

| Field     | Type   | Required |
| --------- | ------ | -------- |
| id_doctor | number | yes      |

#### In body

| Field    | Type   | Required | validation |
| -------- | ------ | -------- | ---------- |
| username | string | yes      | length>6   |

#### Response status

##### `HTTP STATUS 204`

##### `HTTP STATUS 400`

| Key     | Value  |
| ------- | ------ |
| type    | string |
| path    | string |
| message | string |

##### `HTTP STATUS 401/403/500`

---

### Update doctor's password

Update doctor's password

`PUT {{Route}}/:id_doctor/password`

#### In parameters

| Field     | Type   | Required |
| --------- | ------ | -------- |
| id_doctor | number | yes      |

#### In body

| Field           | Type   | Required | validation        |
| --------------- | ------ | -------- | ----------------- |
| password        | string | yes      | length>8          |
| repeat_password | string | yes      | equal to password |

#### Response status

##### `HTTP STATUS 204`

##### `HTTP STATUS 400`

| Key     | Value  |
| ------- | ------ |
| type    | string |
| path    | string |
| message | string |

##### `HTTP STATUS 401/403/500`

---

### Update doctor's name

Update doctor's first and last name

`PUT {{Route}}/:id_doctor/name`

#### In parameters

| Field     | Type   | Required |
| --------- | ------ | -------- |
| id_doctor | number | yes      |

#### In body

| Field      | Type   | Required | validation |
| ---------- | ------ | -------- | ---------- |
| first_name | string | yes      | length<50  |
| last_name  | string | yes      | length<50  |

#### Response status

##### `HTTP STATUS 204`

##### `HTTP STATUS 400`

| Key     | Value  |
| ------- | ------ |
| type    | string |
| path    | string |
| message | string |

##### `HTTP STATUS 401/403/500`

---

### Update doctor's phone number

Update doctor's phone number

`PUT {{Route}}/:id_doctor/number`

#### In parameters

| Field     | Type   | Required |
| --------- | ------ | -------- |
| id_doctor | number | yes      |

#### In body

| Field        | Type   | Required | validation        |
| ------------ | ------ | -------- | ----------------- |
| phone_number | string | yes      | 9 <= length <= 10 |

#### Response status

##### `HTTP STATUS 204`

##### `HTTP STATUS 400`

| Key     | Value  |
| ------- | ------ |
| type    | string |
| path    | string |
| message | string |

##### `HTTP STATUS 401/403/500`

---

### Update doctor's accept method

Update doctor's accept method

`PUT {{Route}}/:id_doctor/accept-method`

#### In parameters

| Field     | Type   | Required |
| --------- | ------ | -------- |
| id_doctor | number | yes      |

#### In body

| Field       | Type    | Required |
| ----------- | ------- | -------- |
| auto_accept | boolean | yes      |

#### Response status

##### `HTTP STATUS 204`

##### `HTTP STATUS 400`

| Key     | Value  |
| ------- | ------ |
| type    | string |
| path    | string |
| message | string |

##### `HTTP STATUS 401/403/500`

---

### Update doctor's daira

Update doctor's daira

`PUT {{Route}}/:id_doctor/daira`

#### In parameters

| Field     | Type   | Required |
| --------- | ------ | -------- |
| id_doctor | number | yes      |

#### In body

| Field    | Type   | Required |
| -------- | ------ | -------- |
| id_daira | number | yes      |

#### Response status

##### `HTTP STATUS 204`

##### `HTTP STATUS 400`

| Key     | Value  |
| ------- | ------ |
| type    | string |
| path    | string |
| message | string |

##### `HTTP STATUS 401/403/500`
