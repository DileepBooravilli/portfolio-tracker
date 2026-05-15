FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY PortfolioTracker.Api.csproj .
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app .
ENV ASPNETCORE_URLS=http://+:5152
ENV ASPNETCORE_ENVIRONMENT=Development
EXPOSE 5152
ENTRYPOINT ["dotnet", "PortfolioTracker.Api.dll"]
