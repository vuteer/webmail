//  a wrapper for axios interceptor
// helps avoid importing and adding headers on each api call
// especially with those calls that require authorization

import axios from "axios";
import envs from "../config/env";

const Instance = axios.create({
  baseURL: envs.api_url,
  withCredentials: true,
});

export default Instance;
