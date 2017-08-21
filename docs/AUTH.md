
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
