import { binDir } from "../../shared/shared";
import { join, resolve } from "path";

/**
 * Paths to the TLS certificate and key files.
 * These are used for setting up HTTPS servers.
 *
 */
const retrieveCertPaths = {
  certFile: resolve(join(import.meta.dir, "certs", "cert.pem")),
  keyFile: resolve(join(import.meta.dir, "certs", "key.pem")),
};

export { retrieveCertPaths };
