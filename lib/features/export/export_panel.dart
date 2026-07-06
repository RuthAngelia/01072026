import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:file_picker/file_picker.dart';
import 'package:share_plus/share_plus.dart';
import '../../core/providers/project_provider.dart';
import '../../services/exporter_service.dart';
import '../../core/theme/app_theme_gen.dart';
import '../../models/landing_page_models.dart';

class ExportPanel extends StatefulWidget {
  const ExportPanel({Key? key}) : super(key: key);

  @override
  State<ExportPanel> createState() => _ExportPanelState();
}

class _ExportPanelState extends State<ExportPanel> {
  bool _isProcessing = false;

  Future<void> _exportJson(LandingPageData data) async {
    setState(() => _isProcessing = true);
    final raw = data.toRawJson();
    final bytes = utf8.encode(raw);

    final path = await FilePicker.platform.saveFile(
      dialogTitle: 'Export Project JSON',
      fileName: '${data.project.name.replaceAll(" ", "_")}.json',
      type: FileType.custom,
      allowedExtensions: ['json'],
    );

    setState(() => _isProcessing = false);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('JSON project file exported!')),
      );
    }
  }

  Future<void> _exportHtml(LandingPageData data) async {
    setState(() => _isProcessing = true);
    final html = ExporterService.generateHtml(data);

    await FilePicker.platform.saveFile(
      dialogTitle: 'Export Landing Page HTML',
      fileName: 'index.html',
      type: FileType.custom,
      allowedExtensions: ['html'],
    );

    setState(() => _isProcessing = false);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Landing page HTML exported!')),
      );
    }
  }

  Future<void> _exportZip(LandingPageData data) async {
    setState(() => _isProcessing = true);
    final zipBytes = ExporterService.generateZip(data);

    await FilePicker.platform.saveFile(
      dialogTitle: 'Export Landing Page Package (ZIP)',
      fileName: '${data.project.name.replaceAll(" ", "_")}_web.zip',
      type: FileType.custom,
      allowedExtensions: ['zip'],
    );

    setState(() => _isProcessing = false);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Landing page package ZIP exported!')),
      );
    }
  }

  Future<void> _exportPdf(LandingPageData data) async {
    setState(() => _isProcessing = true);
    try {
      await ExporterService.printPdf(data);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('PDF Export failed: $e')),
        );
      }
    } finally {
      setState(() => _isProcessing = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Consumer(
      builder: (context, ref, child) {
        final data = ref.watch(activeProjectProvider);

        return SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(40, 40, 40, 120),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Ekspor Landing Page Anda',
                style: theme.textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.w900,
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 4),
              const Text(
                'Unduh file kode bersih Anda dan deploy secara instan di hosting Anda sendiri.',
                style: TextStyle(color: Colors.grey),
              ),
              const SizedBox(height: 40),

              if (_isProcessing)
                const Center(
                  child: Padding(
                    padding: EdgeInsets.all(40.0),
                    child: CircularProgressIndicator(),
                  ),
                )
              else
                GridView.count(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisCount: MediaQuery.of(context).size.width < 900 ? 1 : 2,
                  crossAxisSpacing: 24,
                  mainAxisSpacing: 24,
                  childAspectRatio: 2.5,
                  children: [
                    _buildExportCard(
                      context,
                      title: 'ZIP Web Package',
                      desc: 'Paket lengkap berisi file index.html dan style.css siap deploy ke hosting.',
                      icon: Icons.archive,
                      onTap: () => _exportZip(data),
                    ),
                    _buildExportCard(
                      context,
                      title: 'index.html Langsung',
                      desc: 'Unduh file HTML tunggal dengan css inline untuk preview cepat.',
                      icon: Icons.html,
                      onTap: () => _exportHtml(data),
                    ),
                    _buildExportCard(
                      context,
                      title: 'Backup Project (JSON)',
                      desc: 'Simpan file konfigurasi mentah untuk di-import kembali nanti.',
                      icon: Icons.settings_backup_restore,
                      onTap: () => _exportJson(data),
                    ),
                    _buildExportCard(
                      context,
                      title: 'Print / Simpan PDF',
                      desc: 'Hasilkan dokumen PDF cetak untuk preview konten secara instan.',
                      icon: Icons.picture_as_pdf,
                      onTap: () => _exportPdf(data),
                    ),
                  ],
                ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildExportCard(
    BuildContext context, {
    required String title,
    required String desc,
    required IconData icon,
    required VoidCallback onTap,
  }) {
    final theme = Theme.of(context);
    return Card(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppThemeGen.primary.withOpacity(0.08),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: AppThemeGen.primary, size: 28),
              ),
              const SizedBox(width: 24),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      title,
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      desc,
                      style: const TextStyle(fontSize: 12, color: Colors.grey),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
