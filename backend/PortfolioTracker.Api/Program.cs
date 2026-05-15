using PortfolioTracker.Api.BackgroundServices;
using PortfolioTracker.Api.Data;
using PortfolioTracker.Api.Hubs;
using PortfolioTracker.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// CORS for React dev server
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactDev", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Controllers + SignalR
builder.Services.AddControllers();
builder.Services.AddSignalR();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Application services
builder.Services.AddSingleton<InMemoryStore>();
builder.Services.AddSingleton<PortfolioService>();

// Background simulators
builder.Services.AddHostedService<MarketSimulator>();
builder.Services.AddHostedService<UserActivitySimulator>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("ReactDev");

app.MapControllers();
app.MapHub<PortfolioHub>("/hub/portfolio");

app.Run();
