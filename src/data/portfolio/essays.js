/**
 * @fileoverview “心得”栏目里可以单独打开读的长文。
 * 正文放在 src/content/essays/*.md，都是作者自己写的原文，这里只登记标题、导语和出处。
 */
import fiveSentences from '../../content/essays/five-sentences.md?raw';
import longBoard from '../../content/essays/long-board.md?raw';
import specIsAContract from '../../content/essays/spec-is-a-contract.md?raw';

export const essays = [
  {
    slug: 'five-sentences',
    eyebrow: 'AI 协作心得 · 003',
    title: '和 AI 一起做东西，我现在必说的 5 句话',
    dek: '做联机小游戏「鹅羽鮨」那天出了好几回岔子。回头想，有几回是我话没说到。后来攒了这 5 句话：开工、改东西、做好了、发出去、收工，各说一句。',
    date: '2026.11.16',
    readingTime: '约 7 分钟阅读',
    source: '原是讲给鹅创营同学的一次分享。框里的话可以直接复制，把【】里的字换成自己的。',
    body: fiveSentences,
  },
  {
    slug: 'long-board',
    eyebrow: 'AI 协作心得 · 002',
    title: '长板效应：团队怎样用上彼此的 AI 经验',
    dek: '大家都开始用 AI 做事以后，一个人摸索出来的方法，怎样才能让别人也用上？我用三轮 AI 短片制作对照试了一下：前两轮没省下积分，第三轮省了。',
    date: '2026.11.01',
    readingTime: '约 9 分钟阅读',
    source: '这是我在鹅创营“AI 风向标”第一期交的报告正文，原文照录。文中提到的附件、附录和视频对照没有放上来。',
    body: longBoard,
  },
  {
    slug: 'spec-is-a-contract',
    eyebrow: 'AI 产品心得 · 001',
    title: '当 AI 开始参与研发，产品经理要守住什么？',
    dek: 'AI 把实现变快了，模糊的需求也更快变成“看起来做完了”的代码。产品经理得把问题、边界、验收和责任写成一份谁都能照着做的契约。',
    date: '2026.09.21',
    readingTime: '约 6 分钟阅读',
    body: specIsAContract,
    loop: {
      title: '我的 AI 产品判断闭环',
      steps: ['真实场景', '产品边界', 'AI 行为契约', '可执行交付', '评测与线上证据', '回写下一轮判断'],
    },
  },
];

export const essayBySlug = Object.fromEntries(essays.map((essay) => [essay.slug, essay]));
