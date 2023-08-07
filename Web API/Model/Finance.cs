namespace Web_API.Model
{
    public class Finance
    {
        public int FinancingId { get; set; }
        public int ScenarioId { get; set; }
        public string OrganisationId { get; set; }
        public string Name { get; set; }
        public int StartYear { get; set; }
        public int StartMonth { get; set; }
        public int FinancingAmount { get; set; }
        public string Assumptions { get; set; }
        public int InterestPerYear { get; set; }
        public int Payback { get; set; }
        public int FinancingPeriodMonths { get; set; }
    }
}
