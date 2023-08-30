import { useState } from 'react';
import { createPromiseClient } from '@connectrpc/connect';
import { createConnectTransport } from '@connectrpc/connect-web';
import { ColloService } from '../../gen/collo/v1/collo_connect';
import { ColloRequest, ColloStreamResponse } from '../../gen/collo/v1/collo_pb';
import { Timestamp } from '@bufbuild/protobuf';

const transport = createConnectTransport({
  baseUrl: process.env.NEXT_PUBLIC_GRPC_HOST || "",
});
const client = createPromiseClient(ColloService, transport);

export const useColloState = () => {
  const [collo, setCollo] = useState(new ColloState());
  
  const requestCollo = async (from: Date = new Date(), until: Date = new Date(), keyword: string = '言葉') => {
    const req = new ColloRequest();
    const f = new Timestamp();
    const u = new Timestamp();
    req.from = f;
    req.until = u;
    req.keyword = keyword;
    const stream: AsyncIterable<ColloStreamResponse> = client.colloStream(req);
    for await (const m of stream) {
     setCollo(pvc => pvc.add(m));
    }
  };

  return {
    collo,
    requestCollo,
  };
};

class ColloState {
  // readonly wordsMap = new Map<number, string>();
  // readonly pairsList: Array<[number, number]> = [];
  constructor(
    readonly wordsMap = new Map<number, string>(),
    readonly pairsList = new Map<[number, number], number>(),
  ) {}
  add(m: ColloStreamResponse) {
    const copyWord = new Map(this.wordsMap);
    const copyPair = new Map(this.pairsList);

    for (const [key, word] of Object.entries(m.words)) {
      console.log(`${word}. ${key}`);
      copyWord.set(Number(key), word);
    };
    for(const {values: [wordKey1, wordKey2]} of m.pairs){
      console.log(`pair:${wordKey1}:${wordKey2}`);
      const key: [number, number] = [wordKey1, wordKey2];
      const count = copyPair.get(key) || 0;
      copyPair.set(key, count);
    };

    return new ColloState(copyWord, copyPair);
  }
}
