using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Auto.Plugins.nav_invoice
{
    public sealed class PreInvoiceCreate : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            var organization = (IOrganizationService)serviceProvider.GetService(typeof(IOrganizationService));
            var traceService = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            var pluginContext = (IPluginExecutionContext)serviceProvider.GetService(typeof(IServiceProvider));

            var targetInvoice = (Entity)pluginContext.InputParameters["Target"];

            targetInvoice.GetAttributeValue<string>("nav_name");

            throw new InvalidPluginExecutionException("");
        }
    }
}
