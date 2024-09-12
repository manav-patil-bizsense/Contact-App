using System.ComponentModel.DataAnnotations;

namespace ContactApp.Data
{
    public class Contact
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required")]
        [StringLength(100, ErrorMessage = "Name length can't be more than 100 characters")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Mobile number is required")]
        [Phone(ErrorMessage =
            "Invalid mobile number format")]
        public string Mobile { get; set; }

        [Phone(ErrorMessage = "Invalid secondary mobile number format")]
        public string SecondaryMobile { get; set; }

        [EmailAddress(ErrorMessage = "Invalid email address format")]
        public string Email { get; set; }

        public string PhotoUrl { get; set; }

      
    }
}
