import { promises as fs } from 'fs';
import path from 'path';

const root = process.cwd();
const webRoot = path.join(root, 'apps/web/app');
const apiRoot = path.join(root, 'apps/api/src');
const mobileRoot = path.join(root, 'apps/mobile/app');

const webRoutes = [
  'trending','flips','music','broadcasts','categories','tags/[tag]','studios','studios/family-friendly',
  'collections/[id]','history','library',
  'watch/[id]/clips','watch/[id]/captions','watch/[id]/chapters','watch/[id]/editor','series/[slug]','series/[slug]/[episode]',
  'friends','friends/requests','groups','groups/[id]','inbox','inbox/[threadId]','chat/[roomId]',
  'settings/account','settings/security','settings/payments','settings/notifications','settings/privacy','settings/studio/branding','settings/studio/integrations','settings/store','settings/address','settings/tax',
  'plus','store','store/cart','store/orders','store/orders/[id]','payouts','payouts/tax','memberships','memberships/manage',
  'kidzone/studios','kidzone/approvals','kidzone/time','parent','parent/approvals','parent/pin',
  'guidelines','help','help/articles','help/articles/[slug]','appeals',
  'admin/queues','admin/reports','admin/appeals','admin/users','admin/studios','admin/media','admin/payments','admin/feature-flags','admin/kidzone','admin/newsletters','admin/search'
];

const pageBoiler = (title:string) => `export default function Page(){return (<main className=\"p-6\"><h1 className=\"text-2xl font-semibold\">${title}</h1><p className=\"opacity-70\">TODO</p></main>)}\n`;

async function ensureWeb(){
  for(const r of webRoutes){
    const dir = path.join(webRoot, r);
    await fs.mkdir(dir, { recursive: true });
    const file = path.join(dir, 'page.tsx');
    try{ await fs.access(file); } catch{ await fs.writeFile(file, pageBoiler('/'+r)); }
  }
}

const apiModules = ['store','payouts','tax','feature-flags','reports','appeals'];
const apiFiles = (m:string)=>[
  `modules/${m}/${m}.module.ts`,
  `modules/${m}/${m}.controller.ts`,
  `modules/${m}/${m}.service.ts`
];

function pascal(s:string){return s.replace(/(^|[-_\s])(\w)/g,(_, __, c)=>c.toUpperCase());}

async function ensureApi(){
  for(const m of apiModules){
    for(const rel of apiFiles(m)){
      const f = path.join(apiRoot, rel);
      await fs.mkdir(path.dirname(f), { recursive: true });
      try{ await fs.access(f); } catch{
        const content = `import { Module } from '@nestjs/common';\n@Module({}) export class ${pascal(m)}Module {}`;
        const controller = `import { Controller, Get } from '@nestjs/common';\n@Controller('${m}') export class ${pascal(m)}Controller { @Get() ping(){ return { ok: true } }}`;
        const service = `import { Injectable } from '@nestjs/common';\n@Injectable() export class ${pascal(m)}Service {}`;
        if(f.endsWith('.module.ts')) await fs.writeFile(f, content);
        else if(f.endsWith('.controller.ts')) await fs.writeFile(f, controller);
        else await fs.writeFile(f, service);
      }
    }
  }
}

const mobileScreens = [
  'trending','flips','music','broadcasts','categories','tags/[tag]','studios','player/clips','player/captions','player/chapters',
  'friends','friends/requests','groups','groups/[id]','chat/[roomId]','inbox','inbox/[threadId]',
  'store','store/cart','orders','orders/[id]','payouts','settings/security','settings/payments','settings/notifications','settings/privacy','settings/studio/branding','settings/studio/integrations','parent','parent/approvals','parent/pin','admin/reports','admin/moderation','admin/appeals'
];

async function ensureMobile(){
  for(const r of mobileScreens){
    const dir = path.join(mobileRoot, r);
    await fs.mkdir(dir, { recursive: true });
    const file = path.join(dir, 'index.tsx');
    try{ await fs.access(file); } catch{ await fs.writeFile(file, `import { View, Text } from 'react-native';\nexport default function Screen(){ return <View><Text>${r}</Text></View>; }`); }
  }
}

(async()=>{
  await ensureWeb();
  await ensureApi();
  await ensureMobile();
  console.log('Scaffold complete');
})();
