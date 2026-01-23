export default async function handler(req, res) {
  const result = {
    steps: [],
    success: false
  };

  try {
    /* =======================
       STEP 1: TOKEN
       ======================= */
    result.steps.push({ step: "TOKEN", status: "running" });

    const tokenRes = await fetch(
      "https://m2itest.b2clogin.com/m2itest.onmicrosoft.com/B2C_1_M2I_SignIn/oauth2/v2.0/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: "869dafaa-18b9-4020-a3da-6ceaffbcd6fe",
          scope: "https://m2itest.onmicrosoft.com/b2c-m2i-test/demo.read offline_access",
          code: "eyJraWQiOiJjcGltY29yZV8wOTI1MjAxNSIsInZlciI6IjEuMCIsInppcCI6IkRlZmxhdGUiLCJzZXIiOiIxLjAifQ..PAZn2IVVUhNGzo2W.O3KT9iUCanqdZsc1HeTUwbxZ4K3ETGEpNbEwCDxqifKSKkW7QAG82jDwQC6Jq7BEwG_JJ3NiVwJA-nqF4Xqriy8WJg9dfF2ImrXa1b4jwyLu4eAH5kOzOJzC7cL9jGdjzZ4g6uAJlgEQtpjrZ30u7p5Qg0YJ-LekSdD86KgmgnfAqNnPDZVIGpqVVAT-BaPjS0jZC5AwaTLdg3aLKJsH86lBgB1ISUo3yAF4dkwjc8nnVL5JGU4Tx3BPDxENT92F-h4otSkt2gBFzdggYgeSybDYoDOuFNHPL2uWDrwVm5yi1s6QbpivfjQRCbPr39kzevRX_xfowf82ghI2b4DlAa7zwINd1ICV83Uziq9lyHwfblUy5sbKw9TtNjGO9qjvUUBYs0-sTI8QoG_NkrTmxKMhmrBLjTKBxbt4NJYi1mTXXfCu0TMNq6dnPd14shWGItTEeZxgXxCZ7srlTBMQ7oNGtCy2aO9wV8OdoQ1KzVXFMokcNEvtnABVP8GAMXNrds0xKXyZR1A8tqz35OJOGFQ4_vvIpN_0lIJ7bTlzXxhAIDWF9pkR8KkGETo8tPRB6N54MTfskMHGIpYah2kyNm06ImzhoLjprJBT6WezAYLunSxxBj2RNNqFlGYltYk_IHmal9Ji2lGInYhHip1qGcKDUb0t5TIgk5lLNntqvOKGnZ25N7tSY_ykNlY6IMxjfO_nHrB1Aadprt0fAPbMQF4QMFlPfDicdYp6QIidHBE43R313-NvERy043iJI7hEv8QyxnKPyA-m4w.tbmqu7odPtjwhLv_9a0Dkg",
          redirect_uri: "https://testservicing.azureedge.net/",
          client_secret: "qu-8Q~GxfcGaae8-hpQiMTU18~eu3GJleFPh~aVQ",
          code_verifier: "YTFjNjI1OWYzMzA3MTI4ZDY2Njg5M2RkNmVjNDE5YmEyZGRhOGYyM2IzNjdmZWFhMTQ1ODg3NDcxY2Nl"
        })
      }
    );

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      result.steps[result.steps.length - 1] = {
        step: "TOKEN",
        status: "error",
        message: tokenData.error_description || "Invalid token response"
      };
      return res.status(400).json(result);
    }

    result.steps[result.steps.length - 1].status = "success";
    const accessToken = tokenData.access_token;

    /* =======================
       STEP 2: DELETE
       ======================= */
    result.steps.push({ step: "DELETE SeedDatabase", status: "running" });

    const deleteRes = await fetch(
      "https://m2i-test-api2.azurewebsites.net/api/SeedDatabase",
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    const deleteData = await deleteRes.json();

    if (!deleteData?.data) {
      result.steps[result.steps.length - 1] = {
        step: "DELETE SeedDatabase",
        status: "error",
        message: "DELETE API failed",
        response: deleteData
      };
      return res.status(400).json(result);
    }

    result.steps[result.steps.length - 1].status = "success";

    /* =======================
       STEP 3: GET
       ======================= */
    result.steps.push({ step: "GET SeedDatabase", status: "running" });

    const getRes = await fetch(
      "https://m2i-test-api2.azurewebsites.net/api/SeedDatabase",
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    const getData = await getRes.json();

    result.steps[result.steps.length - 1] = {
      step: "GET SeedDatabase",
      status: "success",
      response: getData
    };

    result.success = true;
    return res.status(200).json(result);

  } catch (err) {
    result.steps.push({
      step: "UNEXPECTED ERROR",
      status: "error",
      message: err.message
    });
    return res.status(500).json(result);
  }
}
