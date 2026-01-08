# Stage 1: Build React App
FROM node:18-alpine AS build
WORKDIR  /app

# Copy package.json and package-lock.json before running npm install
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the app and build
COPY . .

ENV NODE_OPTIONS=--max-old-space-size=4096

RUN npm run build

# Stage 2: Setup Apache Server
FROM httpd:2.4-alpine

# Copy built React app to Apache's public HTML directory
COPY --from=build /app/dist/efm-app /usr/local/apache2/htdocs/

# Update Apache config to serve SPA correctly
RUN sed -i 's/#LoadModule rewrite_module/LoadModule rewrite_module/' /usr/local/apache2/conf/httpd.conf \
    && echo '<Directory "/usr/local/apache2/htdocs">' >> /usr/local/apache2/conf/httpd.conf \
    && echo '    AllowOverride All' >> /usr/local/apache2/conf/httpd.conf \
    && echo '    Options -Indexes' >> /usr/local/apache2/conf/httpd.conf \
    && echo '</Directory>' >> /usr/local/apache2/conf/httpd.conf \
    && echo 'RewriteEngine On' > /usr/local/apache2/htdocs/.htaccess \
    && echo 'RewriteCond %{REQUEST_FILENAME} !-f' >> /usr/local/apache2/htdocs/.htaccess \
    && echo 'RewriteRule ^ index.html [QSA,L]' >> /usr/local/apache2/htdocs/.htaccess

# Expose Apache's default HTTP port
EXPOSE 80

# Start Apache in foreground
CMD ["httpd", "-D", "FOREGROUND"]
