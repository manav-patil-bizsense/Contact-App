using ContactApp.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class ContactsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ContactsController> _logger;

    public ContactsController(ApplicationDbContext context, ILogger<ContactsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    public class PaginatedContactsResponse
    {
        public IEnumerable<Contact> Contacts { get; set; }
        public int TotalCount { get; set; }
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedContactsResponse>> GetContacts(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string searchQuery = "",
        [FromQuery] string sortBy = "name",
        [FromQuery] bool descending = false)
    {
        if (pageNumber < 1)
        {
            _logger.LogWarning("Invalid page number: {PageNumber}", pageNumber);
            return BadRequest("Page number must be greater than 0.");
        }

        if (pageSize <= 0)
        {
            _logger.LogWarning("Invalid page size: {PageSize}", pageSize);
            return BadRequest("Page size must be greater than 0.");
        }

        var query = _context.Contacts.AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchQuery))
        {
            searchQuery = searchQuery.ToLower();
            query = query.Where(c => c.Name.ToLower().Contains(searchQuery) ||
                                     c.Mobile.Contains(searchQuery) ||
                                     c.SecondaryMobile.Contains(searchQuery) ||
                                     c.Email.ToLower().Contains(searchQuery));
        }

        // Apply sorting
        switch (sortBy.ToLower())
        {
            case "name":
                query = descending ? query.OrderByDescending(c => c.Name.ToLower()) : query.OrderBy(c => c.Name.ToLower());
                break;
            case "mobile":
                query = descending ? query.OrderByDescending(c => c.Mobile) : query.OrderBy(c => c.Mobile);
                break;
            default:
                _logger.LogWarning("Invalid sort field: {SortBy}. Defaulting to 'name'.", sortBy);
                query = descending ? query.OrderByDescending(c => c.Name.ToLower()) : query.OrderBy(c => c.Name.ToLower());
                break;
        }

        var totalCount = await query.CountAsync();

        var contacts = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new PaginatedContactsResponse
        {
            Contacts = contacts,
            TotalCount = totalCount
        });
    }

    [HttpPost]
    public async Task<ActionResult<Contact>> PostContact(Contact contact)
    {
        if (!ModelState.IsValid)
        {
            _logger.LogWarning("Invalid contact data: {ModelState}", ModelState);
            return BadRequest(ModelState);
        }

        if (contact == null)
        {
            _logger.LogWarning("Contact data is null.");
            return BadRequest("Contact data is null.");
        }

        _context.Contacts.Add(contact);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Created new contact with ID {ContactId}.", contact.Id);

        return CreatedAtAction(nameof(GetContacts), new { id = contact.Id }, contact);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutContact(int id, Contact contact)
    {
        if (id != contact.Id)
        {
            _logger.LogWarning("Contact ID mismatch: expected {Id}, received {ContactId}.", id, contact.Id);
            return BadRequest("Contact ID mismatch.");
        }

        if (!ModelState.IsValid)
        {
            _logger.LogWarning("Invalid contact data: {ModelState}", ModelState);
            return BadRequest(ModelState);
        }

        _context.Entry(contact).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
            _logger.LogInformation("Updated contact with ID {ContactId}.", id);
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ContactExists(id))
            {
                _logger.LogWarning("Contact with ID {ContactId} not found during update.", id);
                return NotFound($"Contact with ID {id} not found.");
            }
            else
            {
                _logger.LogError("An error occurred while updating the contact with ID {ContactId}.", id);
                throw;
            }
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteContact(int id)
    {
        var contact = await _context.Contacts.FindAsync(id);
        if (contact == null)
        {
            _logger.LogWarning("Contact with ID {ContactId} not found for deletion.", id);
            return NotFound($"Contact with ID {id} not found.");
        }

        _context.Contacts.Remove(contact);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Deleted contact with ID {ContactId}.", id);

        return NoContent();
    }

    private bool ContactExists(int id)
    {
        return _context.Contacts.Any(e => e.Id == id);
    }
}
