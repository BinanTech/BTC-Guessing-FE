/** @type {import('next').NextConfig} */

const path = require("path");
const { parsed: localEnv } = require("dotenv-safe").config({
  allowEmptyValues: false,
  path: path.resolve(__dirname, `.env`),
});

const nextConfig = {
  env: localEnv,
  reactStrictMode: true,
  swcMinify: true,
  eslint: false,
};

module.exports = nextConfig;
