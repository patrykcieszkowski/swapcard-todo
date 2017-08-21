
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
