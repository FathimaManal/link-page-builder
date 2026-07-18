require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const User     = require('./models/User');
const Link     = require('./models/Link');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ username: 'demo' });
  if (existing) {
    await Link.deleteMany({ owner: existing._id });
    await User.deleteOne({ _id: existing._id });
  }

  const user = await User.create({
    username: 'demo',
    email:    'demo@example.com',
    password: await bcrypt.hash('demo1234', 10),
    bio:      'Hey, I am the demo user. Check out my links below!',
  });

  await Link.insertMany([
    { title: 'My Portfolio', url: 'https://example.com/portfolio', order: 0, owner: user._id },
    { title: 'GitHub',       url: 'https://github.com',            order: 1, owner: user._id },
    { title: 'Twitter',      url: 'https://twitter.com',           order: 2, owner: user._id },
    { title: 'LinkedIn',     url: 'https://linkedin.com',          order: 3, owner: user._id },
    { title: 'Blog',         url: 'https://example.com/blog',      order: 4, owner: user._id },
  ]);

  console.log('Seeded: username=demo  email=demo@example.com  password=demo1234');
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
