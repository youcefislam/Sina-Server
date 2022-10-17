# Medecin Route

`{{Route}}={{BASE_URL}}/medecin`

## Table of matters

- [List of all the doctors](#get-doctors-list)
- [Sign Up/ Create new account](#sign-up)
- [Sign In](#sign-in)
- [Validate Token](#validate-token)
- [new account validation](#account-validation)
- [Patient list](#patient-list)
- [Delete from the doctor's patient list](#delete-patient-from-patient-list)
- [Account restoration link](#account-restoration-link)
- [Doctor's info](#doctors-information)
- [Delete account](#delete-account)
- [Doctor's mail](#doctors-mail)
- [Update doctor's mail](#update-doctors-mail)
- [Doctor's username](#doctors-username)
- [Update doctor's username](#update-doctors-username)
- [Update doctor's password](#update-doctors-password)
- [Doctor's name](#doctors-name)
- [Update doctor's name](#update-doctors-name)
- [Doctor's phone number](#doctors-phone-number)
- [Update doctor's phone number](#update-doctors-phone-number)
- [Get doctor's Accept method](#doctors-accept-method)
- [Update doctor's Accept method](#update-doctors-accept-method)
- [get doctor's daira](#doctors-daira)
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
            "idMedecin": 6,
            "userNameMedecin": "test",
            "nomMedecin": "Hamaidi",
            "prenomMedecin": "Youcef",
            "sexeMedecin": false, // false = Male, true = Female
            "autoAccept": false,
            "dateInscriptientMedecin": "2022-10-15T00:00:00.000Z",
            "NumTlfMedecin": "790030013",
            "mailMedecin": "hamaidisyo938o@hotmail.com",
            "idDaira": 2,
            "daira": {
                "idDaira": 2,
                "nomDaira": "Daira 2",
                "idWilaya": 1,
                "wilaya": {
                    "idWilaya": 1,
                    "nomWilaya": "wilaya 1"
                }
            }
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
| email           | string | yes      | valid mail        |
| nom             | string | yes      | length<50         |
| prenom          | string | yes      | length<50         |
| numeroTlf       | string | yes      | length <= 10      |
| sex             | string | yes      | length=1          |
| address         | string | yes      | length<400        |
| wilaya          | number | yes      | -                 |
| daira           | number | yes      | -                 |

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

`GET {{Route}}/:id/patientlist`

#### In parameters

| Field | Type   | Required |
| ----- | ------ | -------- |
| id    | number | yes      |

#### Response status

##### `HTTP STATUS 200`

```
{
    "results": [
        {
            "idPatient": 1,
            "userNamePatient": "patienttest",
            "nomPatient": "Hamaidi",
            "prenomPatient": "youcef islam",
            "sexePatient": false,
            "autoAccept": false,
            "dateNaisPatient": "1998-01-26T00:00:00.000Z",
            "dateInscriptionPatient": "2022-10-15T00:00:00.000Z",
            "NumTlfPatient": "790110064",
            "lienJournalMedicament": "/public/uploads/MedicalJournal/1-1650754800.txt",
            "lienHistoriqueRV": "/public/uploads/ECGfiles/1-1650754800.txt",
            "mailPatient": "hamaidi.yo@gmail.com",
            "idTypeMaladie": 1,
            "idCommune": 2,
            "idMedecin": 6,
            "idProche": 1
        },
        ...
    ]
}
```

##### `HTTP STATUS 401/403/500`

---

### Delete patient from patient list

Remove a patient from the doctor's patient list

`DELETE {{Route}}/:id/patientlist/:idPatient`

#### In parameters

| Field     | Type   | Required |
| --------- | ------ | -------- |
| id        | number | yes      |
| idPatient | number | yes      |

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
| email | string | yes      | Valid mail |

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

`GET {{Route}}/:id`

#### In parameters

| Field | Type   | Required |
| ----- | ------ | -------- |
| id    | number | yes      |

#### Response status

##### `HTTP STATUS 200`

##### `HTTP STATUS 400`

| Key  | Value  |
| ---- | ------ |
| type | string |
| path | string |

##### `HTTP STATUS 401/500`

---

### Delete account

Delete doctor's account

`DELETE {{Route}}/:id`

#### In parameters

| Field | Type   | Required |
| ----- | ------ | -------- |
| id    | number | yes      |

#### Response status

##### `HTTP STATUS 204`

##### `HTTP STATUS 400`

| Key  | Value  |
| ---- | ------ |
| type | string |
| path | string |

##### `HTTP STATUS 401/403/500`

---

### Doctor's mail

Return a doctor's e-mail

`GET {{Route}}/:id/mail`

#### In parameters

| Field | Type   | Required |
| ----- | ------ | -------- |
| id    | number | yes      |

#### Response status

##### `HTTP STATUS 200`

```
{
    "mailMedecin": "hamaidisyo938o@hotmail.com"
}
```

##### `HTTP STATUS 401/500`

---

### Update doctor's mail

Update doctor's e-mail

`PUT {{Route}}/:id/mail`

#### In parameters

| Field | Type   | Required |
| ----- | ------ | -------- |
| id    | number | yes      |

#### In body

| Field | Type   | Required | validation |
| ----- | ------ | -------- | ---------- |
| email | string | yes      | valid mail |

#### Response status

##### `HTTP STATUS 204`

##### `HTTP STATUS 400`

| Key  | Value  |
| ---- | ------ |
| type | string |
| path | string |

##### `HTTP STATUS 401/403/500`

---

### Doctor's username

Return a doctor's username

`GET {{Route}}/:id/username`

#### In parameters

| Field | Type   | Required |
| ----- | ------ | -------- |
| id    | number | yes      |

#### Response status

##### `HTTP STATUS 200`

```
{
    "userNameMedecin": "patienttest"
}
```

##### `HTTP STATUS 401/500`

---

### Update doctor's username

Update doctor's username

`PUT {{Route}}/:id/username`

#### In parameters

| Field | Type   | Required |
| ----- | ------ | -------- |
| id    | number | yes      |

#### In body

| Field    | Type   | Required | validation |
| -------- | ------ | -------- | ---------- |
| username | string | yes      | length>6   |

#### Response status

##### `HTTP STATUS 204`

##### `HTTP STATUS 400`

| Key  | Value  |
| ---- | ------ |
| type | string |
| path | string |

##### `HTTP STATUS 401/403/500`

---

### Update doctor's password

Update doctor's password

`PUT {{Route}}/:id/password`

#### In parameters

| Field | Type   | Required |
| ----- | ------ | -------- |
| id    | number | yes      |

#### In body

| Field           | Type   | Required | validation        |
| --------------- | ------ | -------- | ----------------- |
| password        | string | yes      | length>8          |
| repeat_password | string | yes      | equal to password |

#### Response status

##### `HTTP STATUS 204`

##### `HTTP STATUS 400`

| Key  | Value  |
| ---- | ------ |
| type | string |
| path | string |

##### `HTTP STATUS 401/403/500`

---

### Doctor's name

Return a doctor's first and last name

`GET {{Route}}/:id/name`

#### In parameters

| Field | Type   | Required |
| ----- | ------ | -------- |
| id    | number | yes      |

#### Response status

##### `HTTP STATUS 200`

```
{
    "nomMedecin": "Hamaidi"
    "prenomMedecin": "Youcef Islam"
}
```

##### `HTTP STATUS 401/500`

---

### Update doctor's name

Update doctor's first and last name

`PUT {{Route}}/:id/name`

#### In parameters

| Field | Type   | Required |
| ----- | ------ | -------- |
| id    | number | yes      |

#### In body

| Field  | Type   | Required | validation |
| ------ | ------ | -------- | ---------- |
| nom    | string | yes      | length<50  |
| prenom | string | yes      | length<50  |

#### Response status

##### `HTTP STATUS 204`

##### `HTTP STATUS 400`

| Key  | Value  |
| ---- | ------ |
| type | string |
| path | string |

##### `HTTP STATUS 401/403/500`

---

### Doctor's phone number

Return a doctor's phone number

`GET {{Route}}/:id/number`

#### In parameters

| Field | Type   | Required |
| ----- | ------ | -------- |
| id    | number | yes      |

#### Response status

##### `HTTP STATUS 200`

```
{
    "NumTlfMedecin": "790110064"
}
```

##### `HTTP STATUS 401/500`

---

### Update doctor's phone number

Update doctor's phone number

`PUT {{Route}}/:id/number`

#### In parameters

| Field | Type   | Required |
| ----- | ------ | -------- |
| id    | number | yes      |

#### In body

| Field     | Type   | Required | validation |
| --------- | ------ | -------- | ---------- |
| numeroTlf | string | yes      | length<=10 |

#### Response status

##### `HTTP STATUS 204`

##### `HTTP STATUS 400`

| Key  | Value  |
| ---- | ------ |
| type | string |
| path | string |

##### `HTTP STATUS 401/403/500`

---

### Doctor's accept method

Return a doctor's accept method

`GET {{Route}}/:id/accept-method`

#### In parameters

| Field | Type   | Required |
| ----- | ------ | -------- |
| id    | number | yes      |

#### Response status

##### `HTTP STATUS 200`

```
{
    "autoAccept": false
}
```

##### `HTTP STATUS 401/500`

---

### Update doctor's accept method

Update doctor's accept method

`PUT {{Route}}/:id/accept-method`

#### In parameters

| Field | Type   | Required |
| ----- | ------ | -------- |
| id    | number | yes      |

#### In body

| Field         | Type    | Required |
| ------------- | ------- | -------- |
| accept-method | boolean | yes      |

#### Response status

##### `HTTP STATUS 204`

##### `HTTP STATUS 400`

| Key  | Value  |
| ---- | ------ |
| type | string |
| path | string |

##### `HTTP STATUS 401/403/500`

---

### Doctor's daira

Return a doctor's daira

`GET {{Route}}/:id/daira`

#### In parameters

| Field | Type   | Required |
| ----- | ------ | -------- |
| id    | number | yes      |

#### Response status

##### `HTTP STATUS 200`

```
{
    "idDaira": 2,
    "nomDaira": "Daira 2",
    "idWilaya": 1
}
```

##### `HTTP STATUS 401/500`

---

### Update doctor's daira

Update doctor's daira

`PUT {{Route}}/:id/daira`

#### In parameters

| Field | Type   | Required |
| ----- | ------ | -------- |
| id    | number | yes      |

#### In body

| Field | Type   | Required |
| ----- | ------ | -------- |
| daira | number | yes      |

#### Response status

##### `HTTP STATUS 204`

##### `HTTP STATUS 400`

| Key  | Value  |
| ---- | ------ |
| type | string |
| path | string |

##### `HTTP STATUS 401/403/500`
