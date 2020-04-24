# TO get this app to run locally

1. You need to create a new [Okta developer acount](https://developer.okta.com/)
2. Once you have a developer acount, log into it and above the Okta logo on the top left corner you should see ``` < > Developer Console ```, hover over it and you should be able to see Classic UI. Switch to Classic UI.
3. Once in classic UI go to applications and add applications -> create new application.
4. Select the following ![select the options](https://i.gyazo.com/aaf93ef4ea1bffb9fe59a254b16ac75d.png)
5. Name your app ![name your app](https://i.gyazo.com/c76751f939844de0597efc5396d60d39.png)
6. SAML options ![saml](https://i.gyazo.com/f9d27d83acd3d39d1dec9252235626b5.png) - Replace the sso/recipient/destination URL with the url for your app
7. Download the app certificate and add it to the .env as SAML_CERT.
8. In app.js in the ``` passport.use ``` line add  ``` cert: config.passport.saml.cert ```
9. ``` npm install ```
10. ``` npm start ```
11. If your app is running on localhost this process won't work, try tunneling using [ngrok](https://ngrok.com/) or [localtunnel](https://github.com/localtunnel/localtunnel) that should be the url to use in step 6.
12. ![You should see the following when you run your app](https://i.gyazo.com/74b3d20da3a3b5347abeb5edc4b0fb7e.gif)



# SAML NOTES

- XML based
- SP - Service Provider (the app)
- IDP - Identity Provider (entity providing the identities. Eg: Okta)
- SAML request/Authentication Request (request made by SP to IDP to request authentication)
- SAML response/assertion - generated by IDP, contains actual assertion of the authenticated user. May contain additional information.
- SP never directly interacts with IDP
- SP needs to know which IDP to redirect to before it knows who the user is
- SP does not know who the user is until SAML assertion comes back from the IDP
- SAML authentication flow is asynchronous, no state maintained by IDP

- In order to know that the assertion came from a valid IDP the app needs

- Certificate: Get a public certificate from IDP to validate the signature. Store certificate server side.
- ACS endpoint - Assertion consumer service URL - app login URL - this is where the saml responses will be posted. Need to provide to IDP (step 6 in the diagram below).
- IDP login URL - This is the endpoint on the IDP side where SAML requests are posted (step 4 in the diagram below).

- User tries to log on > app generates SAML request then sends  to browser for deep links set RelayState value to redirect
