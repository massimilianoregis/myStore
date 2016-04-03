angular.module("ngIndex.services",[])
.factory("wish",["$resource","$q",function($resource,$q)		
   {	

	var act = 
		{
		query:function()
			{
			var defer=$q.defer();
			this.load();
			defer.resolve(this);
			return defer.promise;
			},
		name:"good",	
		load:function()
			{			
			this.list=angular.fromJson(localStorage.getItem("wish_"+this.name))||[];
			},
		save:function()
			{			
			localStorage.setItem("wish_"+this.name,angular.toJson(this.list));
			},
		inside:function(obj)
			{
			var result=false;			
			angular.forEach(this.list,function(item)
				{				
				if(item.id==obj.id) result=true;
				});
						
			return result;
			},
		remove:function(obj)
			{
			obj.wish=false;
			var index=-1;
			angular.forEach(this.list,function(item,i)
				{
				if(item.id==obj.id) index=i; 
				});			
			this.list.splice(index,1);
			
			this.save();
			},
		add:function(obj)
			{				
			obj.wish=true;
			if(!this.inside(obj))
				this.list.push(obj);
			
			this.save();
			},		
		get:function(name)
			{				
			var wish =this.wishes[name]; 
			if(wish) return wish;
			
			
			wish = angular.copy(this);			
			wish.name=name;
			wish.load();
			
			this.wishes[name]=wish;			
			return wish; 
			},
		wishes:{},
		list:[]   
	   	};	
	act.load();
	return act;
   }])
.factory("indexItems",["$resource","config","$cacheFactory",function($resource,config,$cacheFactory)		
   {      
   var cache = $cacheFactory('indexItems');      
   var resource = $resource(config.index.url.item,{id:"@id"},
		{
	   	get:
			{			
			method:'GET',
			url:config.index.url.item,
			cache:cache,
			responseType:'json'			
			},
		query:
			{
			isArray:true,
			method:'GET',
			url:config.index.url.item,
			cache:cache,
			responseType:'json'		
			},
		save:
			{
			method:'POST',
			url:config.index.url.item,			
			responseType:'json',
			transformRequest:function(data){
				cache.removeAll();			
				return angular.toJson(data);
			}
			}
		});
   /*
   resource._query=resource.query
   resource.query=function(data,success,error)
   		{	    
	    resource._query(data,function(dt)
	    	{	    	
	    	success(dt);
	    	},error);
   		}*/
   return resource;
   }])
.factory("catalogues",["$resource","config",function($resource,config)		
   {
   return $resource("http://localhost:8080/index/catalogue/:id");	
   }])
.factory("groups",["$cacheFactory","$resource","config",function($cacheFactory,$resource,config)		
   {	
   var cache = $cacheFactory('groups');      
   return $resource(config.index.url.group,{id:"@id"},{
	   remove:
	   		{		   
			url:config.index.url.group,
			transformRequest:function(data)
				{
				cache.removeAll();			
				return angular.toJson(data);
				}
	   		},
	   query:
			{
			isArray:true,
			method:'GET',
			url:config.index.url.group,
			cache:cache,
			responseType:'json'				
			}, 
   		save:{			
			method:'POST',
			url:config.index.url.group,			
			responseType:'json',
			transformRequest:function(data){
				cache.removeAll();			
				return angular.toJson(data);
				}
			}
   	});	
   }])
.factory("pricing",["$cacheFactory","$resource","config",function($cacheFactory,$resource,config)		
   {
   var cache = $cacheFactory('pricing');   
   var res= $resource(config.index.url.pricing,{id:"@id"},{
	   query:
			{
			isArray:true,
			method:'GET',
			url:config.index.url.pricing,
			cache:cache,
			responseType:'json'				
			},
		get:
			{
			method:'GET',
			url:config.index.url.pricing,
			cache:cache,
			responseType:'json'				
			},
		save:{			
			method:'POST',
			url:config.index.url.pricing,			
			responseType:'json',
			transformRequest:function(data){
				cache.removeAll();			
				return angular.toJson(data);
			}
			}, 
   });
   /*
   return {
	   query 	: 	function(data,ok,ko)
	   	{
		 res.query(data,function(data){
			 if(data.length==0) return ok(config.index.defaultPricing);
			 return ok(data);
		 	},function(data){
		 		ko(config.index.defaultPricing);
		 	});  		   
	   	},
	   get		:	res.get,
	   save		:	res.save
   	}*/
   	return res;
   }])
.factory("order",["$resource","config","user",function($resource,config)
	{
	return $resource(config.shop.url.orders,{shop:"",id:"@id"});	
	}]) 
.factory("basketBank",["config","$resource",function(config,$resource)
   {
	var resource = $resource(config.shop.url.basket,{id:"@id"});
   return resource;
   }])
.factory("basket",["order","paypal","$rootScope","config","$resource","$q","user","basketBank","shop","$locale",
                   function(orders,paypal,$rootScope,config,$resource,$q,user,basketBank,shop,$locale)                   
   {
   
   var act = 
	   {	   
	   name:"",
	   status:"new",
	   shop:config.name,
	   clear:function()
	   	  {
		   var act =this;		   
		   angular.forEach(this.rows,function(row)
				{
				row.obj.row=null;
				row.obj.inBasket=false;
				row.qta=0;
				});
		   this.rows=[];
		   this.calc();		   
	   	   },
	   shipping:
	   	   {		   
		   
	   	   },
	   payment:
	   	   {
		 
	   	   },
	   find:function(obj)
	   	   {
		   for(var i in act.rows)
			   if(act.rows[i].obj==obj) return act.rows[i];
		   return null;
	   	   },
	   inside:function(obj)
		   {
		   for(var i in act.rows)
			   if(act.rows[i].obj==obj) return true;
		   return false;
		   },
	   remove:function(row)
	   	   {		   
		   row.obj.row=null;
		   row.obj.inBasket=false;
		   row.obj.bskQta=0;
		   row.qta=0;
		   this.rows.splice(act.rows.indexOf(row),1);	
		   this.total-=parseFloat(row.price);
	   	   },
	   calc:function()
	   	   {
		   var total=0;
		   var items=0;
		   angular.forEach(this.rows,function(item)		  
			   {
		   		total+=item.price*item.qta;
		   		items+=item.qta;
			   });		   
		   if(this.shipping.price!=null) total+=this.shipping.price;
		   this.items=items;		   
		   this.total=total;		   
		   },
	   total:0,
	   sub:function(obj)
	   	   {
		   if(obj.row!=null) 	{obj.row.qta--;  obj.bskQta--;}
		   if(obj.row.qta>0) return this.calc();
		   
		   this.remove(obj.row);
		   obj.row==null;
		   this.calc();
	   	   },
	   sum:function(obj,shop)
	   	   {		   
		   if(obj.row!=null) 	{obj.row.qta++; obj.bskQta++;}
		   else 				this.add(obj);
		   this.calc();
	   	   },
	   add:function(obj,extra)
	   	   {		   
		   var act = this;		
		   var actObj=null;
		   angular.forEach(this.rows,function(row)
				{
			    if(row.obj.id==obj.id) actObj=row;
				})
		   if(actObj!=null) 
			   {
			   actObj.sum();
			   this.calc();
			   return;
			   }
		   var row = 
		   		{
				basket:act,
				img:obj.gallery[0].img,
				code:obj.code,
				sum:function(){this.qta++; this.obj.bskQta++; this.calc();},
				sub:function(){this.qta--; this.obj.bskQta--; this.calc();},
				calc:function()
					{
					this.price=this.obj.price;
					this.total=this.obj.price*this.qta;
					this.basket.calc();
					},
				obj:obj,
				qta:1,
				price:obj.price,
				total:obj.price,
				extra:extra
		   		}
		   if(extra && extra.color) 
			   	{
			    row.img = extra.color.image;
			    row.code=obj.code+"-"+extra.color.name;
			   	}
		   obj.bskQta=1;
		   obj.inBasket=true;
		   obj.row=row;		  
		   
		   act.rows.push(row);
		   $rootScope.$emit("basket:add",row);
		   
		   console.log(this);
		   act.calc();	   
	   	   },
	   rows:[],
	   items:0,
	   data:{},	   
	   shop:config.shop,
	   pay:function(){
		   var act = this;
		   paypal.pay("code","Ordine",this.total,function()
			   {
			   orders.get({id:act.id},function(order)
				   {				   
				   order.status="payed";
				   order.$save();				   
				   })			    
				});
	   	},
	   save:function()
		   	{
			var deferred = $q.defer();
			var that=this;
			debugger;
			basketBank.save(this.toJSON(),function(id)
				{				
				
				that.id=id.id;
				deferred.resolve(id.id);				
				shop.sendNotify({
						from:that.id,
						message:"nuovo ordine ("+that.total+" "+$locale.NUMBER_FORMATS.CURRENCY+") da:\n\r"+user.firstName||user.mail,
						shop:that.shop,
						type:"order"
						})
				});
			return deferred.promise;
		   	},
	   toJSON:function()
	   		{
		    var shipping = this.shipping;
		    var result={
		    	id:this.id,
		    	name:user.firstName+" "+user.lastName,
		    	shop:this.shop,		    	
		    	//data:this.data,
		    	status:this.status,
		    	shipping:{
		    		firstName	: shipping.firstName,
		    		lastName	: shipping.lastName,
		    		line1		: shipping.line1,
			    	line2		: shipping.line2,
		    		address		: shipping.address,
		    		city		: shipping.city,
		    		company		: shipping.company,
		    		country		: shipping.country,
		    		email		: shipping.mail,
		    		phone		: shipping.phone,
		    		name		: shipping.name,
		    		state		: shipping.state,
		    		zip			: shipping.zip
		    		},
		    	payment:this.payment,
		    	user:user.mail,
		    	//total:this.total,
		    	rows:[]
		    	}
		    angular.forEach(this.rows,function(row)
		    	{
		    	result.rows.push({
		    		id:Math.random(),
		    		price:row.price,
		    		name:row.obj.name,
		    		img:row.img,
		    		qta:row.qta,
		    		code:row.code
		    		})
		    	})
		    return result;
	   		}
	   };
   
   return {
	    list:{
	    	
	    },
	   	get:function(shop,callback)
	   		{	   		
	   		if(this.list[shop]) return callback(this.list[shop]);
	   		this.list[shop]= angular.copy(act);
	   		this.list[shop].shop=shop;
	   		if(callback) return callback(this.list[shop]);	   		
	   		}
   		};
   }])
.filter('percentage', ['$window', function ($window) {
        return function (input, decimals, suffix) {
            decimals = angular.isNumber(decimals)? decimals :  3;
            suffix = suffix || '%';
            if ($window.isNaN(input)) {
                return '';
            }
            return Math.round(input * Math.pow(10, decimals + 2))/Math.pow(10, decimals) + suffix
        };
    }]);
