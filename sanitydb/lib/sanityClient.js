import sanityClient from '@sanity/client'

export const client = sanityClient({
  projectId: 'q4kdz28z',
  dataset: 'production',
  apiVersion: '2021-03-25',
  token:
    'sk4LOkDXaecFOk0pBVqdBn0EBRsT0NhgLBbPO4AMuGzP9bTOObaa25bjtW8Cgqvsrdnw9H6rt6n5ovxFBKfcEc2sanbaj93H4GGFCPQLES4Gd2NWcQDncsxPyxlLNnnYtlznas5EyBu5UZBPcNSVc8D55fpit0ORPWx7JjfMtZfPeR6w40Zh',
  useCdn: false,
})