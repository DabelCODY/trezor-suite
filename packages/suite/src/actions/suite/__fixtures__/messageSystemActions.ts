export const messageId1 = '22e6444d-a586-4593-bc8d-5d013f193eba';
export const messageId2 = '469c65a8-8632-11eb-8dcd-0242ac130003';
export const messageId3 = '506b1322-8632-11eb-8dcd-0242ac130003';

// TODO: use factory for creating config and then sign it with private test key

export const validJws =
    'eyJhbGciOiJFUzI1NiJ9.ewogICAidmVyc2lvbiI6IDEsCiAgICJ0aW1lc3RhbXAiOiAiMjAyMS0wMy0wM1QwMzo0ODoxNiswMDowMCIsCiAgICJzZXF1ZW5jZSI6IDEsCiAgICJhY3Rpb25zIjogW10KfQo.1Ml33ky3ZmdWa2FEsF-CFAzP_oZzi5EWToEB-Xp0dA2_ZHYQX5PIlQXsp2-ugp07kSvNKvSKnGWytOPi5Yb-Ng';
// changed signature
export const unauthenticJws =
    'eyJhbGciOiJFUzI1NiJ9.ewogICAidmVyc2lvbiI6IDEsCiAgICJ0aW1lc3RhbXAiOiAiMjAyMS0wMy0wM1QwMzo0ODoxNiswMDowMCIsCiAgICJzZXF1ZW5jZSI6IDEsCiAgICJhY3Rpb25zIjogW10KfQo.ko24cky3ZmdWa2FEsF-CFAzP_oZzi5EWToEB-Xp0dA2_ZHYQX5PIlQXsp2-ugp07kSvNKvSKnGWytOPi5Yb-Ng';
// changed header and payload
export const corruptedJws =
    'JhbGciOiJFUzI1NiJ9.ewogICAidm.ko24cky3ZmdWa2FEsF-CFAzP_oZzi5EWToEB-Xp0dA2_ZHYQX5PIlQXsp2-ugp07kSvNKvSKnGWytOPi5Yb-Ng';
