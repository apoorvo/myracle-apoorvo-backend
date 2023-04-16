# myracle-apoorvo-backend
Backed for myracle fullstack task


## Model3D Schema
```
  - id : Int
  - name : String
  - description? : String
  - url : String (Firebase storage url)
```

## API Schema

### List Models
```  
  /models
    Request Method: GET
    Request Body: {}
    Response Body: {models: Array<Model3D>}
``` 
 ### Create Model
```
  /models
    Request Method: POST
    Request Body: {name: String, description?: String, modelFile: File}
    Response Body: Model3D
```

 ### Get Model
```
  /models/:id 
    Request Method: GET
    Request Body: {}
    Response Body: Model3D
 ```
 ### Edit Model
 ``` 
  /models/:id 
    Request Method: PUT
    Request Body: {name:String, description?: String}
    Response Body: Model3D
 ```
 
### Delete Model 
```  
  /models/:id 
    Request Method: DELETE
    Request Body: {}
    Response Body: {message: "Model deleted successfully"}   
 ```
