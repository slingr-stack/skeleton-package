<table class="table" style="margin-top: 10px">
    <thead>
    <tr>
        <th>Title</th>
        <th>Last Updated</th>
        <th>Summary</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>Dendi LIS package</td>
        <td>December 5, 2023</td>
        <td>Detailed description of the API of the Dendi LIS package.</td>
    </tr>
    </tbody>
</table>

## Overview

The Dendi LIS endpoint allows you to interact with the Dendi API.

Some features are:

- Creation of Orders
- Creation and Sync of Patients
- Webhooks for automatic updates when Orders are ready or rejected

Apart from some helpers you will see that to use the REST API of Dendi you will be making regular HTTP request to the REST API with some optional parameters for filtering.
To see the available parameters go check [API Documentation](https://documenter.getpostman.com/view/12233883/T1Dv9FYf#intro).

## Configuration

To comunicate to Dendi LIS you will only need three fields:

1. **URL of the API of Dendi:** This will be the url where the request will be sent.
   with your credentials for Dendi LIS</li>
2. **API Token:** It can be generated making a request to `{{site_root}}/api/api-token-auth/` with your credentials on the body like:
```
{
    username: {{username}}
    password: {{password}}
}
```
3. **Webhooks Token:** It can be any password that you want. It will be used to validate webhooks coming to the endpoint, so if the password doesn't match, the webhook will be discarded.

## Webhooks

To use API Web-hooks you'll need to configure them on Dendi LIS. This can be done under Admin Tools > Lab Setup > Webhooks.
- Under **Webhook Callback URL** be sure to put the corresponding Slingr App URL like `https://<yourAppName>.slingrs.io/<env>/services/http/dendi/orders`
- Be sure to copy the same token on **Webhook Callback Auth** and on the Dendi LIS endpoint configuration.The token will be injected on the headers of the webhook on the `autorization` header.

# Javascript API

The Javascript API of the dendi lis package has two pieces:

- **HTTP requests**
- **Flow steps**

## HTTP requests
You can make `GET`,`PUT`,`PATCH`,`DELETE` requests to the [Dendi LIS API] like this:
```javascript
var response = pkg.dendi.api.get('/patients')
var response = pkg.dendi.api.put('/patients/' + patientId, {"birth_date": "1980-01-05"});
var response = pkg.dendi.api.post('/orders',{
   "account_uuid": "aebb58c9-f21d-442f-af47-d82471f79f20",
   "provider_uuid": "a4f995e8-4f9d-4561-9db5-0d1167485231",
   "patient_uuid": "18b659b2-bee5-4902-b0d6-6b11b2a08554",
   ...
});
var response = pkg.dendi.api.delete('/orders/' + orderId);
```

Please take a look at the documentation of the [HTTP service](https://github.com/slingr-stack/http-service)
for more information about generic requests.

## Flow Step

As an alternative option to using scripts, you can make use of Flows and Flow Steps specifically created for the endpoint:
<details>
    <summary>Click here to see the Flow Steps</summary>

<br>

### Generic Flow Step

Generic flow step for full use of the entire endpoint and its services.

<h3>Inputs</h3>

<table>
    <thead>
    <tr>
        <th>Label</th>
        <th>Type</th>
        <th>Required</th>
        <th>Default</th>
        <th>Visibility</th>
        <th>Description</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>URL (Method)</td>
        <td>choice</td>
        <td>yes</td>
        <td> - </td>
        <td>Always</td>
        <td>
            This is the http method to be used against the endpoint. <br>
            Possible values are: <br>
            <i><strong>GET,PUT,PATCH,DELETE</strong></i>
        </td>
    </tr>
    <tr>
        <td>URL (Path)</td>
        <td>choice</td>
        <td>yes</td>
        <td> - </td>
        <td>Always</td>
        <td>
            The url to which this endpoint will send the request. This is the exact service to which the http request will be made. <br>
        </td>
    </tr>
    <tr>
        <td>Headers</td>
        <td>keyValue</td>
        <td>no</td>
        <td> - </td>
        <td>Always</td>
        <td>
            Used when you want to have a custom http header for the request.
        </td>
    </tr>
    <tr>
        <td>Query Params</td>
        <td>keyValue</td>
        <td>no</td>
        <td> - </td>
        <td>Always</td>
        <td>
            Used when you want to have a custom query params for the http call.
        </td>
    </tr>
    <tr>
        <td>Body</td>
        <td>json</td>
        <td>no</td>
        <td> - </td>
        <td>Always</td>
        <td>
            A payload of data can be sent to the server in the body of the request.
        </td>
    </tr>
    <tr>
        <td>Override Settings</td>
        <td>boolean</td>
        <td>no</td>
        <td> false </td>
        <td>Always</td>
        <td></td>
    </tr>
    <tr>
        <td>Follow Redirect</td>
        <td>boolean</td>
        <td>no</td>
        <td> false </td>
        <td> overrideSettings </td>
        <td>It Indicates that the resource has to be downloaded into a file instead of returning it in the response.</td>
    </tr>
    <tr>
        <td>Download</td>
        <td>boolean</td>
        <td>no</td>
        <td> false </td>
        <td> overrideSettings </td>
        <td>If true, the method won't return until the file has been downloaded, and it will return all the information of the file.</td>
    </tr>
    <tr>
        <td>File name</td>
        <td>text</td>
        <td>no</td>
        <td></td>
        <td> overrideSettings </td>
        <td>If provided, the file will be stored with this name. If empty, the file name will be calculated from the URL.</td>
    </tr>
    <tr>
        <td>Full response</td>
        <td> boolean </td>
        <td>no</td>
        <td> false </td>
        <td> overrideSettings </td>
        <td>Includes extended information about response</td>
    </tr>
    <tr>
        <td>Connection Timeout</td>
        <td> number </td>
        <td>no</td>
        <td> 5000 </td>
        <td> overrideSettings </td>
        <td>Connect a timeout interval in milliseconds (0 = infinity).</td>
    </tr>
    <tr>
        <td>Read Timeout</td>
        <td> number </td>
        <td>no</td>
        <td> 60000 </td>
        <td> overrideSettings </td>
        <td>Read a timeout interval in milliseconds (0 = infinity).</td>
    </tr>
    </tbody>
</table>

<h3>Outputs</h3>

<table>
    <thead>
    <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Description</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>response</td>
        <td>object</td>
        <td>
            Object resulting from the response to the endpoint call.
        </td>
    </tr>
    </tbody>
</table>


</details>

For more information about how shortcuts or flow steps work, and how they are generated, take a look at the [slingr-helpgen tool](https://github.com/slingr-stack/slingr-helpgen).

## Dependencies
* HTTP Service (Latest Version)

## About SLINGR

SLINGR is a low-code rapid application development platform that accelerates development, with robust architecture for integrations and executing custom workflows and automation.

[More info about SLINGR](https://slingr.io)

## License

This endpoint is licensed under the Apache License 2.0. See the `LICENSE` file for more details.
