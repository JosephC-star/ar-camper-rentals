import test from 'node:test';
import assert from 'node:assert/strict';
import {youtubeVideoId,youtubeWatchUrl} from '../lib/youtube.ts';
const id='M7lc1UVf-VE';
test('accepts supported YouTube video URL formats',()=>{
 for(const link of [`https://youtube.com/watch?v=${id}`,`https://youtu.be/${id}?si=abc`,`youtube.com/shorts/${id}`,`https://youtube.com/live/${id}`,`https://m.youtube.com/watch?v=${id}`,`https://www.youtube-nocookie.com/embed/${id}`])assert.equal(youtubeVideoId(link),id,link);
});
test('rejects deceptive hosts, executable input, credentials and non-video links',()=>{
 for(const link of ['https://evil.example/watch?v='+id,'https://youtube.com.evil.example/watch?v='+id,'javascript:alert(1)','<iframe src="https://youtube.com/embed/'+id+'"></iframe>','https://user:password@youtube.com/watch?v='+id,'https://youtube.com/playlist?list=123','https://youtube.com/watch?v=bad','https://youtube.com:444/watch?v='+id])assert.equal(youtubeVideoId(link),null,link);
});
test('clearing an optional video returns no video',()=>{
 for(const link of ['',undefined,'   ']){assert.equal(youtubeVideoId(link),null);assert.equal(youtubeWatchUrl(link),'')}
});
test('canonicalizes a shared link and discards unrelated parameters',()=>{
 assert.equal(youtubeWatchUrl(`https://youtu.be/${id}?si=abc&autoplay=1&origin=https://evil.example`),`https://www.youtube.com/watch?v=${id}`);
});
