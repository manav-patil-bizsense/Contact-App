using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ContactApp.Migrations
{
    /// <inheritdoc />
    public partial class withoutfav : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsFavorite",
                table: "Contacts");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsFavorite",
                table: "Contacts",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }
    }
}
