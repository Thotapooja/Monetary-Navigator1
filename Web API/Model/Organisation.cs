namespace Web_API.Model
{
    public class Organisation
    {
        public string OrganisationId { get; set; }
        public string Name { get; set; }
        public string Website { get; set; }
        public string Sector { get; set; }
        public string SubSector { get; set; }
        public string Description { get; set; }
        public string Country { get; set; }
        public string Currency { get; set; }
        public int FoundedYear { get; set; }
    }
}
