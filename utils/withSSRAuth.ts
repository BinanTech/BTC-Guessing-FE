import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { destroyCookie, parseCookies } from "nookies";

interface WithSSRAuthOptions {
  permissions: string[];
  roles: string[];
}

interface DecodeTypes {
  permissions: string[];
  roles: string[];
}

export function withSSRAuth(
  fn: GetServerSideProps,
  options?: WithSSRAuthOptions
): GetServerSideProps {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<any>> => {
    const cookies = parseCookies(ctx);

    const token = cookies["nextauth.token"];

    if (!token) {
      return {
        redirect: {
          destination: "/auth/login",
          permanent: false,
        },
      };
    }

    try {
      return await fn(ctx);
    } catch (err) {
      destroyCookie(ctx, "nextauth.token");
      destroyCookie(ctx, "nextauth.refreshToken");

      return {
        redirect: {
          destination: "/auth/login",
          permanent: false,
        },
      };
    }
  };
}
