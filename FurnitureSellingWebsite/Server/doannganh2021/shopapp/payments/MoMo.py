import json
import urllib3
import uuid
import hmac
import hashlib

# parameters send to MoMo get get payUrl
endpoint = "https://test-payment.momo.vn/v2/gateway/api/create"
partnerCode = "MOMO7GJL20211109"
accessKey = "6k2pop7zMRcMmySP"
secretKey = "nmfctKyjpGpmVZSuF8WBXz2Qi3l7EytL"
orderInfo = "pay with MoMo"
redirectUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b"
ipnUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b"
amount = "50000"
orderId = str(uuid.uuid4())
requestId = str(uuid.uuid4())
requestType = "captureWallet"
extraData = ""  # pass empty value or Encode base64 JsonString


# before sign HMAC SHA256 with format: accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl
# &orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId
# &requestType=$requestType
rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType


# puts raw signature
print("--------------------RAW SIGNATURE----------------")
print(rawSignature)
# signature
h = hmac.new(secretKey, rawSignature, hashlib.sha256)
signature = h.hexdigest()
print("--------------------SIGNATURE----------------")
print(signature)

# json object send to MoMo endpoint

data = {
    'partnerCode': partnerCode,
    'partnerName': "Test",
    'storeId': "MomoTestStore",
    'requestId': requestId,
    'amount': amount,
    'orderId': orderId,
    'orderInfo': orderInfo,
    'redirectUrl': redirectUrl,
    'ipnUrl': ipnUrl,
    'lang': "vi",
    'extraData': extraData,
    'requestType': requestType,
    'signature': signature
}
print("--------------------JSON REQUEST----------------\n")
data = json.dumps(data)
print(data)

clen = len(data)
req = urllib3.Request(endpoint, data, {'Content-Type': 'application/json', 'Content-Length': clen})
f = urllib3.urlopen(req)

response = f.read()
f.close()
print("--------------------JSON response----------------\n")
print(response + "\n")

print("payUrl\n")
print(json.loads(response)['payUrl'] + "\n")
