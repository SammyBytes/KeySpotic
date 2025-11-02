import { binDir } from "../../shared/shared";
import { join } from "path";

/**
 * Paths to the TLS certificate and key files.
 * These are used for setting up HTTPS servers.
 *
 */
const retrieveCertPaths = {
  certFile: join(__dirname, "certs", "cert.pem"),
  keyFile: join(__dirname, "certs", "key.pem"),
};

export { retrieveCertPaths };
