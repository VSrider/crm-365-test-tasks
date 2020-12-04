using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Auto.ConsoleApp.Repositories
{
    public class CommunicationRepository
    {
        private readonly IOrganizationService _service;
        private readonly ILogger _logger;
        public CommunicationRepository(IOrganizationService service, ILogger logger)
        {

        }

        public void Create(Entity entity)
        {

        }
    }
}
