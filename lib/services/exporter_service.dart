import 'dart:convert';
import 'package:archive/archive.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import '../models/landing_page_models.dart';
import 'mock_templates.dart';

class ExporterService {
  static String generateHtml(LandingPageData data) {
    final brand = data.brand;
    final hero = data.hero;
    final benefits = data.benefits;
    final bridge = data.productBridge;
    final bonuses = data.bonuses;
    final testimonials = data.testimonials;
    final offer = data.offer;
    final faq = data.faq;
    final footer = data.footer;

    final primary = brand.primaryColor;
    final secondary = brand.secondaryColor;
    final bg = brand.backgroundColor;
    final text = brand.textColor;
    final radius = '${brand.borderRadius}px';

    final template = MockTemplates.templates.firstWhere(
      (t) => t.id == data.selectedTemplateId,
      orElse: () => MockTemplates.templates.first,
    );
    final sections = template.sectionOrder.split(',');

    final htmlBlocks = <String>[];

    for (final sec in sections) {
      switch (sec.trim()) {
        case 'hero':
          if (hero.enabled) {
            htmlBlocks.add('''
  <!-- Hero Section -->
  <section class="hero">
    <div class="container hero-content">
      <h1>${hero.headline}</h1>
      <p>${hero.subheadline}</p>
      <a href="${hero.ctaTarget}" class="btn btn-primary">${hero.ctaText}</a>
    </div>
  </section>''');
          }
          break;
        case 'benefits':
          if (benefits.enabled) {
            htmlBlocks.add('''
  <!-- Benefits Section -->
  <section class="benefits">
    <div class="container">
      <div class="section-title">
        <h2>${benefits.title}</h2>
        <p>${benefits.subtitle}</p>
      </div>
      <div class="benefits-grid">
        ${benefits.items.map((b) => '''
        <div class="benefit-card">
          <span class="benefit-icon">⚡</span>
          <h3>${b.title}</h3>
          <p>${b.description}</p>
        </div>''').join('')}
      </div>
    </div>
  </section>''');
          }
          break;
        case 'bridge':
          if (bridge.enabled) {
            htmlBlocks.add('''
  <!-- Product Bridge Section -->
  <section class="bridge">
    <div class="container bridge-layout">
      <div class="bridge-info">
        <h2>${bridge.title}</h2>
        <p>${bridge.description}</p>
        <a href="#offer" class="btn btn-primary">${bridge.ctaText}</a>
      </div>
      <div class="bridge-media">
        <span>Mockup Workspace</span>
      </div>
    </div>
  </section>''');
          }
          break;
        case 'bonuses':
          if (bonuses.enabled) {
            htmlBlocks.add('''
  <!-- Bonus Section -->
  <section class="bonuses">
    <div class="container">
      <div class="section-title">
        <h2>${bonuses.title}</h2>
      </div>
      <div class="bonus-grid">
        ${bonuses.items.map((b) => '''
        <div class="bonus-card">
          <div class="bonus-info">
            <span class="bonus-badge">Value: ${b.value}</span>
            <h3>${b.title}</h3>
            <p>${b.description}</p>
          </div>
        </div>''').join('')}
      </div>
    </div>
  </section>''');
          }
          break;
        case 'testimonials':
          if (testimonials.enabled) {
            htmlBlocks.add('''
  <!-- Testimonials Section -->
  <section class="testimonials">
    <div class="container">
      <div class="section-title">
        <h2>${testimonials.title}</h2>
      </div>
      <div class="testimonials-grid">
        ${testimonials.items.map((t) => '''
        <div class="testimonial-card">
          <div class="rating">★★★★★</div>
          <p>"${t.content}"</p>
          <div class="author-info">
            <div class="author-avatar"></div>
            <div>
              <h4>${t.name}</h4>
              <p>${t.role}</p>
            </div>
          </div>
        </div>''').join('')}
      </div>
    </div>
  </section>''');
          }
          break;
        case 'offer':
          if (offer.enabled) {
            htmlBlocks.add('''
  <!-- Offer Section -->
  <section class="offer" id="offer">
    <div class="container">
      <div class="offer-card">
        <h2>${offer.title}</h2>
        <p>${offer.description}</p>
        <div class="offer-price">
          <div class="old-price">${offer.price}</div>
          <div class="new-price">${offer.discountPrice}</div>
        </div>
        <a href="#" class="btn btn-primary">${offer.ctaText}</a>
        <ul class="features-list">
          ${offer.features.map((f) => '<li>$f</li>').join('')}
        </ul>
      </div>
    </div>
  </section>''');
          }
          break;
        case 'faq':
          if (faq.enabled) {
            htmlBlocks.add('''
  <!-- FAQ Section -->
  <section class="faq">
    <div class="container">
      <div class="section-title">
        <h2>${faq.title}</h2>
      </div>
      <div class="faq-list">
        ${faq.items.map((f) => '''
        <div class="faq-item">
          <h3>${f.question}</h3>
          <p>${f.answer}</p>
        </div>''').join('')}
      </div>
    </div>
  </section>''');
          }
          break;
        case 'footer':
          if (footer.enabled) {
            htmlBlocks.add('''
  <!-- Footer Section -->
  <footer>
    <div class="container">
      <p>${footer.copyrightText}</p>
      <div>
        ${footer.links.map((link) => '<a href="#">$link</a>').join('')}
      </div>
    </div>
  </footer>''');
          }
          break;
      }
    }

    return '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.basicInfo.title}</title>
  <meta name="description" content="${data.basicInfo.description}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=${brand.fontHeading}:wght@700;800&family=${brand.fontBody}:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: $primary;
      --secondary: $secondary;
      --bg: $bg;
      --text: $text;
      --radius: $radius;
      --font-heading: '${brand.fontHeading}', sans-serif;
      --font-body: '${brand.fontBody}', sans-serif;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: var(--font-body);
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.6;
    }

    h1, h2, h3, h4 {
      font-family: var(--font-heading);
      font-weight: 800;
      letter-spacing: -0.02em;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    /* Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 14px 28px;
      font-weight: 700;
      border-radius: var(--radius);
      text-decoration: none;
      transition: all 0.2s ease-in-out;
      cursor: pointer;
      border: none;
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: white;
      box-shadow: 0 8px 24px rgba(99, 102, 241, 0.2);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 32px rgba(99, 102, 241, 0.35);
    }

    /* Section defaults */
    section {
      padding: 100px 0;
    }

    .section-title {
      text-align: center;
      margin-bottom: 60px;
    }

    .section-title h2 {
      font-size: 36px;
      margin-bottom: 16px;
    }

    /* Hero */
    .hero {
      text-align: center;
      padding: 140px 0;
      background: radial-gradient(circle at top, rgba(99, 102, 241, 0.08), transparent);
    }

    .hero h1 {
      font-size: 54px;
      max-width: 800px;
      margin: 0 auto 24px;
      line-height: 1.15;
    }

    .hero p {
      font-size: 20px;
      color: #64748b;
      max-width: 600px;
      margin: 0 auto 36px;
    }

    /* Benefits */
    .benefits {
      background-color: rgba(0, 0, 0, 0.01);
    }

    .benefits-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 32px;
    }

    .benefit-card {
      background: white;
      padding: 40px;
      border-radius: var(--radius);
      border: 1px solid #f1f5f9;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.01);
    }

    .benefit-icon {
      font-size: 24px;
      margin-bottom: 16px;
      display: block;
    }

    .benefit-card h3 {
      font-size: 20px;
      margin-bottom: 12px;
    }

    .benefit-card p {
      color: #64748b;
      font-size: 15px;
    }

    /* Bridge */
    .bridge-layout {
      display: flex;
      align-items: center;
      gap: 60px;
    }

    .bridge-info {
      flex: 1;
    }

    .bridge-info h2 {
      font-size: 36px;
      margin-bottom: 20px;
    }

    .bridge-info p {
      color: #64748b;
      margin-bottom: 32px;
      font-size: 16px;
    }

    .bridge-media {
      flex: 1;
      height: 350px;
      background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
      border-radius: var(--radius);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #64748b;
      font-weight: 600;
    }

    /* Bonuses */
    .bonus-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }

    .bonus-card {
      background: white;
      border-radius: var(--radius);
      border: 1px solid #f1f5f9;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.01);
    }

    .bonus-badge {
      display: inline-block;
      padding: 4px 10px;
      background: #f1f5f9;
      color: #475569;
      font-size: 11px;
      font-weight: 700;
      border-radius: 20px;
      margin-bottom: 12px;
    }

    .bonus-info {
      padding: 24px;
    }

    .bonus-info h3 {
      font-size: 18px;
      margin-bottom: 8px;
    }

    /* Offer */
    .offer {
      background: white;
    }

    .offer-card {
      max-width: 600px;
      margin: 0 auto;
      text-align: center;
      padding: 60px;
      border-radius: var(--radius);
      border: 1px solid #f1f5f9;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
    }

    .offer-card h2 {
      font-size: 32px;
      margin-bottom: 16px;
    }

    .offer-card p {
      color: #64748b;
      margin-bottom: 32px;
    }

    .offer-price {
      margin-bottom: 32px;
    }

    .old-price {
      text-decoration: line-through;
      color: #94a3b8;
      font-size: 18px;
    }

    .new-price {
      font-size: 48px;
      font-weight: 800;
      color: var(--primary);
    }

    .features-list {
      list-style: none;
      text-align: left;
      max-width: 320px;
      margin: 32px auto 0;
    }

    .features-list li {
      padding: 10px 0;
      border-bottom: 1px solid #f1f5f9;
      color: #475569;
    }

    .features-list li::before {
      content: "✓";
      color: var(--primary);
      font-weight: bold;
      margin-right: 12px;
    }

    /* FAQ */
    .faq-list {
      max-width: 800px;
      margin: 0 auto;
    }

    .faq-item {
      padding: 24px 0;
      border-bottom: 1px solid #f1f5f9;
    }

    .faq-item h3 {
      font-size: 18px;
      margin-bottom: 12px;
    }

    .faq-item p {
      color: #64748b;
    }

    /* Footer */
    footer {
      background: #0f172a;
      color: white;
      padding: 60px 0;
      text-align: center;
    }

    footer p {
      font-size: 14px;
    }
  </style>
</head>
<body>

  ${htmlBlocks.join('\n\n')}

</body>
</html>''';
  }

  static List<int> generateZip(LandingPageData data) {
    final archive = Archive();
    final html = generateHtml(data);

    archive.addFile(ArchiveFile('index.html', html.length, utf8.encode(html)));

    return ZipEncoder().encode(archive)!;
  }

  static Future<void> printPdf(LandingPageData data) async {
    final doc = pw.Document();

    doc.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.a4,
        build: (pw.Context context) {
          return pw.Column(
            crossAxisAlignment: pw.CrossAxisAlignment.start,
            children: [
              pw.Text(data.basicInfo.title, style: pw.TextStyle(fontSize: 28, fontWeight: pw.FontWeight.bold)),
              pw.SizedBox(height: 8),
              pw.Text(data.basicInfo.description, style: const pw.TextStyle(fontSize: 14)),
              pw.SizedBox(height: 24),
              pw.Text('Hero Headline:', style: pw.TextStyle(fontWeight: pw.FontWeight.bold)),
              pw.Text(data.hero.headline),
              pw.SizedBox(height: 16),
              pw.Text('Offer Summary:', style: pw.TextStyle(fontWeight: pw.FontWeight.bold)),
              pw.Text('${data.offer.title} - ${data.offer.discountPrice}'),
              pw.SizedBox(height: 24),
              pw.Text('Exported from local LandingPage Generator sandbox.', style: const pw.TextStyle(fontSize: 10, color: PdfColors.grey)),
            ],
          );
        },
      ),
    );

    await Printing.layoutPdf(
      onLayout: (PdfPageFormat format) async => doc.save(),
    );
  }
}
