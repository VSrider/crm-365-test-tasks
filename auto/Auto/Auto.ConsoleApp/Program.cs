using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Auto.ConsoleApp
{
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
            Console.ReadKey();
        }
    }
}
