# swapcard-todo
swapcard excercise

## commands
  * ##### npm run dev
    compiles with babel and runs on a watchdog (`nodemon`) (doesn't save)

  * ##### npm run build
    compiles and outputs the app to `./dist` directory

  * ##### npm run start
    runs `npm run build` and starts the app with `node dist/app.js`

  * ##### npm run flow
    checks for static typing errors

  * #### npm run test
    runs mocha tests. Models + Routes (run `npm run dev` first!)

## endpoints
  App is build in **RESTful** and **CURD** standard

  * ### /auth
    * #### POST /auth/signup
      ```json
      {
          "body": {
            "email": "me@me.com",
            "password": "superlongpassword"
          }
      }
      ```

      #### responses:
        * **200** - success
            ```json
            {
                "success": true,
                "token": "<TOEKN>"
            }
            ```
        * **400** - missing params
            ```json
            {
                "message": "Missing arguments (<param:type>)"
            }
            ```
        * **401** - validation failed
            ```json
            {
                "message": "<ERROR MESSAGE>"
            }
            ```

        * #### POST /auth/signup
        ```json
        {
            "body": {
              "email": "me@me.com",
              "password": "superlongpassword"
            }
        }
        ```

    * #### POST /auth/login
      ```json
      {
          "email": "me@me.com",
          "password": "superlongpassword"
      }
      ```

      #### responses:
        * **200** - success
            ```json
            {
                "success": true,
                "token": "<TOEKN>"
            }
            ```
        * **400** - missing params
            ```json
            {
                "message": "Missing arguments (<param:type>)"
            }
            ```
        * **401** - validation failed
            ```json
            {
                "message": "<ERROR MESSAGE>"
            }
            ```

    * #### DELETE /auth
      ```json
      {
          "headers": {
            "x-access-token": "<TOKEN>"
          }
      }
      ```

      #### responses:
        * **200** - success
            ```json
            {
                "success": true
            }
            ```
        * **400** - missing params
            ```json
            {
                "message": "Missing arguments (<param:type>)"
            }
            ```
        * **401** - validation failed
            ```json
            {
                "message": "<ERROR MESSAGE>"
            }
            ```
        * **401** - invalid token is passed
            ```json
            {
                "message": "Invalid access token provided."
            }
            ```

  * ### /task
    * #### POST /task
      ```json
      {
          "headers": {
            "x-access-token": "<TOKEN>"
          },
          "body": {
            "title": "test"
          }
      }
      ```

      #### responses:
        * **200** - success
            ```json
            {
                "success": true,
                "result": {
                  "id": "599af9ae669ddc93bcf93bb4",
                  "title": "test",
                  "status": 0,
                  "_groups": [],
                  "createdAt": "2017-08-21T15:18:06.633Z",
                  "updatedAt": "2017-08-21T15:18:06.633Z"
              }
            }
            ```
        * **400** - missing params
            ```json
            {
                "message": "Missing arguments (<param:type>)"
            }
            ```
        * **401** - validation failed
            ```json
            {
                "message": "<ERROR MESSAGE>"
            }
            ```
        * **401** - invalid token is passed
            ```json
            {
                "message": "Invalid access token provided."
            }
            ```

    * #### PUT /task/:taskId
      ```json
      {
          "headers": {
            "x-access-token": "<TOKEN>"
          },
          "body": {
            "title": "new title",
            "status": 1,
            "_groups": [
                "599af9ae669ddc93bcf93bb2"
            ]
          }
      }
      ```

      #### responses:
        * **200** - success
            ```json
            {
                "success": true,
                "result": {
                  "id": "599af9ae669ddc93bcf93bb4",
                  "title": "new title",
                  "status": 1,
                  "_groups": [
                      "599af9ae669ddc93bcf93bb2"
                  ],
                  "createdAt": "2017-08-21T15:18:06.633Z",
                  "updatedAt": "2017-08-21T15:18:06.633Z"
              }
            }
            ```
        * **400** - missing params
            ```json
            {
                "message": "Missing arguments (<param:type>)"
            }
            ```
        * **401** - validation failed
            ```json
            {
                "message": "<ERROR MESSAGE>"
            }
            ```

        * **401** - invalid token is passed
            ```json
            {
                "message": "Invalid access token provided."
            }
            ```

    * #### GET /task
      ```json
      {        
          "headers": {
            "x-access-token": "<TOKEN>"
          }
      }
      ```

      #### responses:
        * **200** - success
            ```json
            {
                "success": true,
                "result": [
                  {
                    "id": "599af9ae669ddc93bcf93bb4",
                    "title": "new title",
                    "status": 1,
                    "_groups": [
                      {
                        "id": "599af9ae669ddc93bcf93bb2",
                        "title": "home",
                        "createdAt": "2017-08-21T15:18:06.633Z",
                        "updatedAt": "2017-08-21T15:18:06.633Z",
                      }
                    ],
                    "createdAt": "2017-08-21T15:18:06.633Z",
                    "updatedAt": "2017-08-21T15:18:06.633Z"
                  }
                ]
            }
            ```
        * **400** - missing params
            ```json
            {
                "message": "Missing arguments (<param:type>)"
            }
            ```
        * **401** - validation failed
            ```json
            {
                "message": "<ERROR MESSAGE>"
            }
            ```
        * **401** - invalid token is passed
            ```json
            {
                "message": "Invalid access token provided."
            }
            ```

    * #### DELETE /task/:taskId
      ```json
      {        
          "headers": {
            "x-access-token": "<TOKEN>"
          }
      }
      ```

      #### responses:
        * **200** - success
            ```json
            {
                "success": true
            }
            ```
        * **400** - missing params
            ```json
            {
                "message": "Missing arguments (<param:type>)"
            }
            ```
        * **401** - validation failed
            ```json
            {
                "message": "<ERROR MESSAGE>"
            }
            ```
        * **401** - invalid token is passed
            ```json
            {
                "message": "Invalid access token provided."
            }
            ```

  * ### /group
    * #### POST /group
      ```json
      {
          "headers": {
            "x-access-token": "<TOKEN>"
          },
          "body": {
            "title": "test"
          }
      }
      ```

      #### responses:
        * **200** - success
            ```json
            {
                "success": true,
                "result": {
                  "id": "599af9ae669ddc93bcf93bb4",
                  "title": "test",
                  "createdAt": "2017-08-21T15:18:06.633Z",
                  "updatedAt": "2017-08-21T15:18:06.633Z"
              }
            }
            ```
        * **400** - missing params
            ```json
            {
                "message": "Missing arguments (<param:type>)"
            }
            ```
        * **401** - validation failed
            ```json
            {
                "message": "<ERROR MESSAGE>"
            }
            ```
        * **401** - invalid token is passed
            ```json
            {
                "message": "Invalid access token provided."
            }
            ```

    * #### PUT /group/:groupId
      ```json
      {
          "headers": {
            "x-access-token": "<TOKEN>"
          },
          "body": {
            "title": "new title"
          }
      }
      ```

      #### responses:
        * **200** - success
            ```json
            {
                "success": true,
                "result": {
                  "id": "599af9ae669ddc93bcf93bb4",
                  "title": "new title",
                  "createdAt": "2017-08-21T15:18:06.633Z",
                  "updatedAt": "2017-08-21T15:18:06.633Z"
              }
            }
            ```
        * **400** - missing params
            ```json
            {
                "message": "Missing arguments (<param:type>)"
            }
            ```
        * **401** - validation failed
            ```json
            {
                "message": "<ERROR MESSAGE>"
            }
            ```

        * **401** - invalid token is passed
            ```json
            {
                "message": "Invalid access token provided."
            }
            ```

    * #### GET /group
      ```json
      {        
          "headers": {
            "x-access-token": "<TOKEN>"
          }
      }
      ```

      #### responses:
        * **200** - success
            ```json
            {
                "success": true,
                "result": [
                  {
                    "id": "599af9ae669ddc93bcf93bb4",
                    "title": "new title",
                    "createdAt": "2017-08-21T15:18:06.633Z",
                    "updatedAt": "2017-08-21T15:18:06.633Z"
                  }
                ]
            }
            ```
        * **400** - missing params
            ```json
            {
                "message": "Missing arguments (<param:type>)"
            }
            ```
        * **401** - validation failed
            ```json
            {
                "message": "<ERROR MESSAGE>"
            }
            ```
        * **401** - invalid token is passed
            ```json
            {
                "message": "Invalid access token provided."
            }
            ```

    * #### DELETE /group/:groupId
      ```json
      {        
          "headers": {
            "x-access-token": "<TOKEN>"
          }
      }
      ```

      #### responses:
        * **200** - success
            ```json
            {
                "success": true
            }
            ```
        * **400** - missing params
            ```json
            {
                "message": "Missing arguments (<param:type>)"
            }
            ```
        * **401** - validation failed
            ```json
            {
                "message": "<ERROR MESSAGE>"
            }
            ```
        * **401** - invalid token is passed
            ```json
            {
                "message": "Invalid access token provided."
            }
            ```
