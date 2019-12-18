import axios from "axios";

export async function getKeywords(text, azureKey) {
  const textAnalyticsData = {
    documents: [
      {
        language: "en",
        id: "1",
        text: text
      }
    ]
  };

  const textAnalyticsUrl = `https://eastus.api.cognitive.microsoft.com/text/analytics/v2.1/keyPhrases`;

  const response = await axios.post(textAnalyticsUrl, textAnalyticsData, {
    headers: {
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": azureKey
    }
  });

  return response.data.documents[0].keyPhrases;
}
