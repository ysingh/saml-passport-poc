require('dotenv').config()

module.exports = {
    port: process.env.PORT || 3000,
    passport: {
      strategy: 'saml',
      saml: {
        path: process.env.SAML_PATH || '/login/callback',
        entryPoint: process.env.SAML_ENTRY_POINT,
        issuer: 'passport-saml',
        cert: process.env.SAML_CERT || null
      }
    }
  }
