import { binDir } from "../shared/shared";
import { join } from "path";

/**
 * Paths to the TLS certificate and key files.
 * These are used for setting up HTTPS servers.
 *
 */
const retrieveCertPaths = {
  certFile: join(binDir, "certs", "cert.pem"),
  keyFile: join(binDir, "certs", "key.pem"),
};

export { retrieveCertPaths };
