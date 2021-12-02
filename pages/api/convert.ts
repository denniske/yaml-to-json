// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import YAML from 'yaml'

type Data = {
  name: string;
  url: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const url = req.query.url as string;

  const response = await axios({
    method: 'GET',
    url,
  });

  const result = YAML.parse(response.data);

  const thirtyMinutes = 60 * 30;
  const sixtyMinutes = 60 * 60;

  res
      .status(200)
      .setHeader('Cache-Control', `s-maxage=${thirtyMinutes}, stale-while-revalidate=${sixtyMinutes}`)
      .json(result);
}

// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) {
//   const url = req.query.url as string;
//   res.status(200).json({ name: 'John Doe', url })
// }
