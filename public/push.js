var webPush = require('web-push');
 
const vapidKeys = {
   "publicKey": "BPH-gPUb9wcKcn0hvjxFb_wbZpjcOOhDNjmZb-EfWIIfLH8j-QLYcPr3M9bXVqoPrx5dOzqlYIsbEEd8jbgUOjU",
   "privateKey": "OE17Hfk1-5Jv0FO0NH2ZAy-IQ2BgOV3O5UcQpoZEaJA"
};
 
 
webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
var pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/ci-JQ7vCu-8:APA91bFiIYoT5EG_S_-3fo7wWV6gq4WXMsxMrH0q0fWg_8lDm9LzGowN11O_BAQ2HwrZH4V4jKBjxiHMoJ04gYmKea-isuPZH1TGya6bIq_p1cgoXpk3uw0BRnAV04tIUX-c2t6-Aqyi",
   "keys": {
       "p256dh": "BFHSkgIkPGWD6PZ9SKpg8sRk/m13MS71x0LNkAi+K8AQ4nhZ/beZjwZ5GLFtVeab9rkmHbJQtMc+6mqBDPeKH4A=",
       "auth": "9zlFIFMJanYZ02drYqZi8Q=="
   }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';
 
var options = {
   gcmAPIKey: '228832564693',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
);