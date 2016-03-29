angular.module('app')

.value("config",
	{
	version:"0.9.11",
	style:"css/style1.css",
	placeholder:"/img/placeholder.jpg",
//	name:"My Shop",
//	shop:"My Shop",
//	tel:"+393284590306",
	countries:
		{
		url:"data/country.json"
		},
	community:
		{
		url:{
			removeuserRole:"http://95.110.228.140:8080/openCommunity/community/:user/delrole/:role",
			adduserRole:"http://95.110.228.140:8080/openCommunity/community/:user/addrole/:role",
			userByRole: "http://95.110.228.140:8080/openCommunity/community/role/:role",
			user	:	"http://95.110.228.140:8080/openCommunity/community/user/:mail",//"data/users/list.json",
			single  :	"http://95.110.228.140:8080/openCommunity/community/userget",//"data/users/list.json",
			login	:	"http://95.110.228.140:8080/openCommunity/community/login",//"data/users/:mail.json",
			logout	:	"http://95.110.228.140:8080/openCommunity/community/logout",
			register:	"http://95.110.228.140:8080/openCommunity/community/register",
			sendPsw	:	"http://95.110.228.140:8080/openCommunity/community/:mail/sendPsw",
			jwt		:	"http://95.110.228.140:8080/openCommunity/community/jwt",
			otp		:	"http://95.110.228.140:8080/openCommunity/community/login/uid?uid=:id",
			device	:	"http://95.110.228.140:8080/openCommunity/community/notify/:mail/addDevice?type=ios&id=:id",
			sendMsg	:	"http://95.110.228.140:8080/openCommunity/community/notify/:to/send?msg=:msg&from=:from&type=:type"
			}
		},
	messages:
		{
		url:{
			list	:	"http://95.110.228.140:8080/openCommunity/message/list?to=:to&from=:from"
			}
		},
	shop:
		{
		url:{
			sendMsg 	:   "http://95.110.228.140:8080/openIndex/index/shop/:shop/send?message=:message",
			answer		:   "http://95.110.228.140:8080/openIndex/index/shop/:shop/answer?to=:to&message=:message",
			sendNotify	:   "http://95.110.228.140:8080/openIndex/index/shop/:shop/send/:type?message=:message&from=:from",
			basket  	:   "http://95.110.228.140:8080/openBasket/basket/:id",
			orders  	:   "http://95.110.228.140:8080/openBasket/basket/:id?shop=:shop&user=:user",			
			listByStaff	:	"http://95.110.228.140:8080/openIndex/index/owner?mail=:mail"
			}
		},
	index:
		{		
		url:{
			classes :   "http://95.110.228.140:8080/openIndex/index/class/:id",
			item	:	"http://95.110.228.140:8080/openIndex/index/item/:id",
			group	:	"http://95.110.228.140:8080/openIndex/index/category/:id",
			pricing	:	"http://95.110.228.140:8080/openIndex/index/pricing/:id",
			//item  :	 "http://95.110.228.140:8080/openIndex/index/item/:id",
			//item	:	"data/:shop/items:id.json",
			//group	:	"data/:shop/groups:id.json",
			//pricing	:	"data/:shop/pricing:id.json",
			basket	:	"http://95.110.228.140:8080/openIndex/basket/:id"		
			}
		},		
	news:
		{
		url:{
			item	:	"http://95.110.228.140:8080/openIndex/index/:shop/news/:id"
			}
		},
	location:
		{
		url:{
			//addlink	:   "http://localhost:8080/inpub/link/add",
			//item	:	"http://localhost:8080/location/:id"
			addlink	:   "http://95.110.224.34:8080/inpub-0.0.1-SNAPSHOT/inpub/link/add",
			item	:	"http://95.110.228.140:8080/openIndex/index/shop/:id",
			//item	:	"data/:id/shop.json"
			//item	:	"/shop"
			//item	:	"https://blistering-fire-1397.firebaseio.com/myshop/shops/:id"
			}
		},
	order:
		{
		anyUser:true
		},
	basket:
		{
		url:{
			item	: "data/:shop/orders/list:id.json"
			}
		},
	urls:
		{
		configuration:"data/esempio1/configuration.json",
		community:"95.110.224.34:8080/community"
		},
	time:{
		start	:	"8:00",
		end		:	"22:00"
		},
	data:{}	
	})