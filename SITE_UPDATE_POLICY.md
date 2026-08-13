# MCU Tracker Site Güncelleme Kuralı

MCU Tracker Ultimate için uygulama tarafında yapılan her kullanıcıya yansıyan güncelleme veya fix, aynı çalışma içinde web sitesine de yansıtılmalıdır.

## Zorunlu akış

1. Uygulamada yeni sürüm yayınlanıyorsa `app/changelog.json` ve ilgili sürüm bilgileri güncellenir.
2. Sürüm numarası değişmeden bir bakım/fix yapılıyorsa `site-updates.json` güncellenir.
3. Değişiklik kullanıcıya anlatılan bir özellik, hesap sistemi, platform desteği, gizlilik metni veya kurulum yöntemini değiştiriyorsa kök `index.html` de güncellenir.
4. `site-release-sync.js`, `app/latest.json`, `app/changelog.json` ve `site-updates.json` üzerinden siteyi güncel tutar.
5. Basit bir fix için uygulama sürümü gereksiz yere yükseltilmez; site bakım akışında gösterilir.
6. Roadmap özellikleri yalnızca kullanıcı açıkça ilgili `Plan N` komutunu verdiğinde uygulanır.

Bu kural MCU Tracker Ultimate için sonraki bakım çalışmalarında varsayılan yayın prosedürüdür.
