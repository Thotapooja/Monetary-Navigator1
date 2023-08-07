using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Web_API.Interfaces;
using Web_API.Model;
using Web_API.Repositories;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddTransient<IEmailSender, EmailSender>();

// Add services to the container.
builder.Services.AddDbContext<MonetaryNavigatorContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("MonetaryNavigator")));

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors((setup) =>
{
    setup.AddPolicy("default", (options) =>
    {
        options.AllowAnyMethod().AllowAnyHeader().AllowAnyOrigin();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
        options.RoutePrefix = string.Empty;
        options.DocumentTitle = "Test Swagger";
    });
}
app.UseCors("default");
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
