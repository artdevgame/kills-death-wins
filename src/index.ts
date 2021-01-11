import config from 'config';
import fs, { promises } from 'fs';
import dayjs from 'dayjs';

import fastify from 'fastify';
import fastifyNoIcon from 'fastify-no-icon';
import fastifyHelmet from 'fastify-helmet';
import fastifyCors from 'fastify-cors';

enum GameIds {
  FORTNITE = 21216,
}

interface RequestBody {
  gameId: number;
  event: string;
  data: unknown;
}

const prepareStats = () => {
  const files: string[] = [config.get('logs.deaths'), config.get('logs.kills'), config.get('logs.wins')];

  for (const file of files) {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, '0', { encoding: 'utf8' });
      continue;
    }
    if (dayjs(fs.statSync(file).atime).isBefore(dayjs(), 'day')) {
      fs.copyFileSync(file, `${file}.yesterday`);
      fs.writeFileSync(file, '0', { encoding: 'utf8' });
    }
  }
};

const updateValueInFile = (file) => {
  const value = fs.existsSync(file) ? Number(fs.readFileSync(file, { encoding: 'utf8' })) : 0;
  fs.writeFileSync(file, (value + 1).toString(), { encoding: 'utf8' });
};

const server = fastify({ logger: true });

server.register(fastifyNoIcon);
server.register(fastifyHelmet);
server.register(fastifyCors);

server.post('/shots-fired', async (request) => {
  const { gameId, event, data } = request.body as RequestBody;
  if (gameId !== GameIds.FORTNITE) return Promise.resolve(true);
  switch (event.toLowerCase()) {
    case 'kill.kill':
      updateValueInFile(config.get('logs.kills'));
      break;
    case 'death.death':
      updateValueInFile(config.get('logs.deaths'));
      break;
    case 'rank.rank':
      if (Number(data) !== 1) return Promise.resolve(true);
      updateValueInFile(config.get('logs.wins'));
      break;
    default:
      break;
  }
  return Promise.resolve(true);
});

const start = async () => {
  try {
    await server.listen(3000);
    prepareStats();
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
