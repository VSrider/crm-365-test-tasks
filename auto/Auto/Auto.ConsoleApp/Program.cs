using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Xrm.Tooling.Connector;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Auto.ConsoleApp
{
    enum CommunicationType
    {
        Phone = 1,
        Email = 2,
    }

    class Program
    {

        static void Main(string[] args)
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

            var connectionString = "AuthType=OAuth; " +
                                   "Url=https://bedwork.crm4.dynamics.com/; " +
                                   "Username=admin@ipbobr.onmicrosoft.com; " +
                                   "Password=!qwe24680; " +
                                   "RequireNewInstance=true; " +
                                   "AppId=51f81489-12ee-4a9e-aaae-a2591f45987d; " +
                                   "RedirectUri=app://58145B91-0C36-4500-8554-080854F2AC97;" +
                                   "LoginPrompt=Auto";
            CrmServiceClient client = new CrmServiceClient(connectionString);
            if (client.LastCrmException != null)
            {
                Console.WriteLine(client.LastCrmException);
            }

            

            string fetch = @"<fetch mapping='logical'>
                                <entity name='nav_communication'>
                                    <attribute name='nav_communicationid' />
                                    <attribute name='nav_contactid' />
                                    <attribute name='nav_phone' />
                                    <attribute name='nav_email' />
                                    <attribute name='nav_type' />
                                    <attribute name='nav_main' />
                                    <filter>
                                        <condition attribute='nav_main' operator='eq' value='1' />
                                    </filter>
                                </entity>
                            </fetch>";
            var fetchexp = new FetchExpression(fetch);

            EntityCollection collection = client.RetrieveMultiple(fetchexp);
            foreach(var item in collection.Entities)
            {
                var contactId = item.GetAttributeValue<EntityReference>("nav_contactid");
                var type = item.GetAttributeValue<OptionSetValue>("nav_type");
                var entity = new Entity("contact", contactId.Id);
                
                if (type.Value == (int) CommunicationType.Email)
                {
                    entity.Attributes["emailaddress1"] = item.GetAttributeValue<string>("nav_email");
                    client.Update(entity);
                }
                else if(type.Value == (int) CommunicationType.Phone)
                {
                    entity.Attributes["telephone1"] = item.GetAttributeValue<string>("nav_phone");
                    client.Update(entity);
                }
            }
            
            var contactfetch = @"<fetch mapping='logical'>  
                         <entity name='contact'>    
                            <attribute name='contactid'/>
                            <attribute name='emailaddress1'/>
                            <attribute name='telephone1'/>
                            <link-entity name='nav_communication' from='nav_contactid' to='contactid' link-type='outer'/>
                            <filter type='and'>
                                <condition entityname='nav_communication' attribute='nav_communicationid' operator='null'/>
                            </filter>
                         </entity>  
                        </fetch>";
            fetchexp = new FetchExpression(contactfetch);
            
            var ncollection = client.RetrieveMultiple(fetchexp);

            foreach(var item in ncollection.Entities)
            {
                var telephone = item.GetAttributeValue<string>("telephone1");
                var email = item.GetAttributeValue<string>("email");
                
                if (email != null && telephone != null)
                {
                    var telEntity = new Entity("nav_communication");
                    telEntity.Attributes["nav_name"] = "Телефон";
                    telEntity.Attributes["nav_phone"] = telephone;
                    telEntity.Attributes["nav_main"] = true;
                    var emailEntity = new Entity("nav_communication");
                    emailEntity.Attributes["nav_email"] = email;
                    emailEntity.Attributes["nav_email"] = "Email";
                    emailEntity.Attributes["nav_main"] = false;
                } 
                else if(email != null)
                {
                    var emailEntity = new Entity("nav_communication");
                    emailEntity.Attributes["nav_email"] = email;
                    emailEntity.Attributes["nav_email"] = "Email";
                    emailEntity.Attributes["nav_main"] = false;

                }
                else if(telephone != null)
                {
                    var telEntity = new Entity("nav_communication");
                    telEntity.Attributes["nav_name"] = "Телефон";
                    telEntity.Attributes["nav_phone"] = telephone;
                    telEntity.Attributes["nav_main"] = true;
                }
            }

            Console.ReadKey();
        }
    }
}


