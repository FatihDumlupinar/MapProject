namespace MapProject.Handlers
{
    public static class ExceptionHandler
    {
        /// <summary>
        /// Uygulama da hata oluşursa..
        /// </summary>
        public static IApplicationBuilder UseCustomExceptionHandler(this IApplicationBuilder builder, IWebHostEnvironment env)
        {

            if (env.IsDevelopment())
            {
                builder.UseExceptionHandler("/error-development");
            }
            else
            {
                builder.UseExceptionHandler("/error");
                builder.UseHsts();
            }

            return builder;
        }
    }
}
