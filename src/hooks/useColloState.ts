import { useState } from 'react';
import { createPromiseClient } from '@connectrpc/connect';
import { createConnectTransport } from '@connectrpc/connect-web';
import { ColloService } from '@/collo/v1/collo_connect';
import { ColloRequest } from '@/collo/v1/collo_pb';
import { Timestamp } from '@bufbuild/protobuf';

const transport = createConnectTransport({
  baseUrl: process.env.NEXT_PUBLIC_GRPC_HOST || '',
});

export const useColloState = () => {
  const [collo, setCollo] = useState(new ColloNetwork());

  const requestCollo = async (from: Date = new Date(), until: Date = new Date(), keyword: string = '言葉') => {
    const client = createPromiseClient(ColloService, transport);
    const req = new ColloRequest();
    const f = new Timestamp();
    const u = new Timestamp();
    req.from = f;
    req.until = u;
    req.keyword = keyword;
    const stream = client.colloStream(req);
    console.log("GET Stream");
    for await (const m of stream) {
      setCollo((pvCl) => {
        console.log("GET RESPONSE", m);
        const copyWord = new Map(pvCl.wordsMap);
        const copyPair = new Map(pvCl.pairsList);

        for (const [key, word] of Object.entries(m.words)) {
          copyWord.set(Number(key), String(word));
        }
        for (const { values } of m.pairs) {
          if (!values.length) continue;
          const [id1, id2] = values;
          const key = ColloNetwork.joinWordsID(id1, id2);
          const count = copyPair.get(key) || 0;
          copyPair.set(key, count + 1);
        }

        return new ColloNetwork(copyWord, copyPair);
      });
    }
  };

  return {
    collo,
    requestCollo,
  };
};

class ColloNetwork {
  /**
   * 共起ペアを表す
   * @param wordsMap 識別子をキーに持つ単語のマップ
   * @param pairsList 識別子のペア(ColloState.joinWordsID)をキーに持つ出現回数のマップ
   */
  constructor(
    readonly wordsMap = new Map<number, string>(),
    readonly pairsList = new Map<string, number>(),
  ) {}
  mapPairs() {
    const result = new Array<{ pairs: [string, string]; count: number }>();
    for (const [ids, count] of this.pairsList.entries()) {
      const [id1, id2] = this.splitWordsID(ids);
      const w1 = this.wordsMap.get(id1) || '';
      const w2 = this.wordsMap.get(id2) || '';
      result.push({ pairs: [w1, w2], count });
    }
    return result;
  }
  private splitWordsID(ids: string): [number, number] {
    const [id1, id2] = ids.split(':');
    return [Number(id1), Number(id2)];
  }
  static joinWordsID(id1: number, id2: number): string {
    return `${id1}:${id2}`;
  }
}
