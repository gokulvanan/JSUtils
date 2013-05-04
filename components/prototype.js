//******************************PROTOTYPE Functions added to String and Array to provide use full methods as in JAVA.************************
String.prototype.trim= function ()
{
	return this.replace(/^\s*|\s*$/g,"");
};


/**
 * Note: the method below works like contains of ArrayList in java.
 * @param key (String/ number)
 * @return Boolean
 */
Array.prototype.contains= function (key)
{
	try{
		if(!this)//condition is true for this= null or undefined
			return false;
		else
		{
			for(var i=0 in this)	
			{

				if (this[i])
				{

					if(typeof this[i]=="string" && typeof key=="string" && this[i].trim()==key.trim())
						return true;

					else if(typeof this[i]=="number"  && typeof key=="number" &&this[i]==key)
						return true;
					else 
						continue;
				}
			}
			return false;
		}

	}catch(err)
	{
		alert("Error in prototype Array.prototype.contains method err Msg-"+err.message);
		return false;
	}
};

/**
 * Note: the method below works like remove of ArrayList in java.
 * @param key (String/ number)
 * @return Boolean
 */
Array.prototype.remove= function (key)
{
	try{
		if(!this)//condition is true for this= null or undefined
			return false;
		else
		{
			for(var i=0 in this)	
			{
				if (this[i])
				{
					if(typeof this[i]=="string" && typeof key=="string" && this[i].trim()==key.trim())
					{
						this.splice(i,1);
						return true;
					}	
					else if(typeof this[i]=="number"  && typeof key=="number" &&this[i]==key)
					{
						this.splice(i,1);
						return true;
					}
					else 
						continue;
				}

			}
			return false;
		}

	}catch(err)
	{
		alert("Error in prototype Array.remove.contains method err Msg-"+err.message);
		return false;
	}

};