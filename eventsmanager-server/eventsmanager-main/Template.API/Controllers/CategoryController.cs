using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Template.Data.Entities;
using Template.Domain.Services;

namespace Template.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] 
    public class CategoryController : ControllerBase
    {
        private readonly IEventService _eventService;

        public CategoryController(IEventService eventService)
        {
            _eventService = eventService;
        }

        [HttpGet]
        [AllowAnonymous] 
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
            IEnumerable<Category> categories = await _eventService.GetAllCategoriesAsync();
            return Ok(categories);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")] 
        public async Task<ActionResult<Category>> CreateCategory(Category category)
        {
            Category created = await _eventService.CreateCategoryAsync(category);
            return Ok(created);
        }
    }
}