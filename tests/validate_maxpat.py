import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
reports = []

for filename in ['StudieII_Generator.maxpat', 'StudieII_Voice.maxpat']:
    path = os.path.join(ROOT, filename)
    data = json.load(open(path, encoding='utf-8'))['patcher']
    boxes = {entry['box']['id']: entry['box'] for entry in data['boxes']}

    for line in data['lines']:
        patchline = line['patchline']
        source_id, source_outlet = patchline['source']
        destination_id, destination_inlet = patchline['destination']
        assert source_id in boxes, (filename, 'missing source', source_id)
        assert destination_id in boxes, (filename, 'missing destination', destination_id)
        source_outlets = boxes[source_id].get('numoutlets')
        destination_inlets = boxes[destination_id].get('numinlets')
        if source_outlets is not None:
            assert 0 <= source_outlet < source_outlets, (filename, source_id, source_outlet, source_outlets)
        if destination_inlets is not None:
            assert 0 <= destination_inlet < destination_inlets, (filename, destination_id, destination_inlet, destination_inlets)

    js_dependencies = []
    for box in boxes.values():
        text = box.get('text', '')
        if text.startswith('js '):
            js_name = text.split()[1]
            js_dependencies.append(js_name)
            assert os.path.exists(os.path.join(ROOT, js_name)), (filename, 'missing js', js_name)
        if text.startswith('poly~ '):
            patch_name = text.split()[1]
            if not patch_name.endswith('.maxpat'):
                patch_name += '.maxpat'
            assert os.path.exists(os.path.join(ROOT, patch_name)), (filename, 'missing poly patch', patch_name)

    reports.append({
        'file': filename,
        'boxes': len(boxes),
        'patchlines': len(data['lines']),
        'jsDependencies': js_dependencies,
    })

print(json.dumps({'status': 'ok', 'patches': reports}, indent=2))
